import { afterEach, expect, test } from 'vitest';
import { mkdtemp, mkdir, writeFile, rm, readdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createMarkdownProcessor } from '@astrojs/markdown-remark';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import type { LoaderContext } from 'astro/loaders';
import { obsidianLoader, type VaultNote } from '@situ2001/astro-obsidian-content-provider';

const roots: string[] = [];
afterEach(async () => { await Promise.all(roots.splice(0).map(root => rm(root, { recursive: true, force: true }))); });
const publicNote = (body: string) => `---\nshared: true\n---\n${body}`;
async function load(files: Record<string, string>, filter = (note: VaultNote) => note.properties.shared === true, base = '/') {
  const root = await mkdtemp(join(tmpdir(), 'obsidian-semantics-'));
  roots.push(root);
  for (const [name, text] of Object.entries(files)) {
    const file = join(root, 'vault', name);
    await mkdir(dirname(file), { recursive: true });
    await writeFile(file, text);
  }
  const entries = new Map<string, { body: string; data: Record<string, unknown>; rendered: { html: string } }>();
  const renderer = await createMarkdownProcessor({ syntaxHighlight: false, smartypants: false, remarkPlugins: [remarkMath], rehypePlugins: [rehypeKatex] });
  const loader = obsidianLoader({ vault: join(root, 'vault'), filter, mapProperties: note => ({ ...note.properties, tags: note.tags }), url: id => `/notes/${id}/` });
  const context = {
    store: { clear: () => entries.clear(), set: (entry: any) => entries.set(entry.id, entry) },
    parseData: async ({ data }: any) => data,
    renderMarkdown: async (body: string) => { const result = await renderer.render(body); return { html: result.code, metadata: result.metadata }; },
    config: { base, publicDir: pathToFileURL(join(root, 'public') + '/') }, logger: { info() {} },
  } as unknown as LoaderContext;
  await loader.load(context);
  return { entries, root, html: (name: string) => entries.get(`obsidian/${name}`)!.rendered.html };
}

test('bare names prefer the vault root; explicit relative paths and case-insensitive suffix candidates follow Obsidian order', async () => {
  const { html } = await load({
    'A/Source.md': publicNote('[[note|root]] [[./NOTE|local]] [[deep/Note|deep]] [[Other|nearest]] [[/Other|missing]]'),
    'Note.md': publicNote('root'), 'A/Note.md': publicNote('local'), 'A/deep/Note.md': publicNote('deep'),
    'A/Other.md': publicNote('near'), 'A/deep/Other.md': publicNote('deeper'), 'B/Other.md': publicNote('far'),
  });
  expect(html('A/Source')).toContain('href="/notes/obsidian/Note/">root</a>');
  expect(html('A/Source')).toContain('href="/notes/obsidian/A/Note/">local</a>');
  expect(html('A/Source')).toContain('href="/notes/obsidian/A/deep/Note/">deep</a>');
  expect(html('A/Source')).toContain('href="/notes/obsidian/A/Other/">nearest</a>');
  expect(html('A/Source')).not.toContain('>missing</a>');
});

test('WikiLinks normalize whitespace and Unicode but keep literal percent escapes; Markdown URLs use decodeURI and colon protocols remain external', async () => {
  const { html } = await load({
    'Source.md': publicNote('[[ Cafe\u0301\u00a0Note | café ]] [[%41|literal]] [decoded](%41.md) [reserved](A%23B.md) [ftp](ftp://example.com/a) [obsidian](obsidian://open?vault=test)'),
    'Café Note.md': publicNote('café'), '%41.md': publicNote('percent'), 'A.md': publicNote('A'), 'A%23B.md': publicNote('hash'),
  });
  expect(html('Source')).toContain('href="/notes/obsidian/Caf%C3%A9%20Note/">café</a>');
  expect(html('Source')).toContain('href="/notes/obsidian/%41/">literal</a>');
  expect(html('Source')).toContain('href="/notes/obsidian/A/">decoded</a>');
  expect(html('Source')).toContain('href="/notes/obsidian/A%23B/">reserved</a>');
  expect(html('Source')).toContain('href="ftp://example.com/a"');
  expect(html('Source')).toContain('href="obsidian://open?vault=test"');
});

test('frontmatter preserves YAML types and only string tag values without spaces participate in selection', async () => {
  const { entries } = await load({
    'Typed.md': '---\nshared: true\ndate: 2026-10-01\nTags: [" #web ", 42, true, "two words", "中文", "a,b"]\naliases: [Alias]\n---\nText',
    'Scalar.md': '---\nshared: true\ntags: one two\n---\nText',
  });
  expect(entries.get('obsidian/Typed')!.data).toMatchObject({ shared: true, date: '2026-10-01', tags: ['web', '中文', 'a,b'], aliases: ['Alias'] });
  expect(entries.get('obsidian/Scalar')!.data.tags).toEqual([]);
});

test('heading and block links resolve punctuation, nested headings and case to anchors that exist in the published target', async () => {
  const { html } = await load({
    'Source.md': publicNote('[[Target#Hello World|heading]] [[Target#Parent#Child|nested]] [[Target#^MY-ID|block]]'),
    'Target.md': publicNote('## **Hello**, World!\n\nParagraph ^My-ID\n\n## Parent\n\n### Child\n\nChild body\n\n## End'),
  });
  expect(html('Source')).toContain('href="/notes/obsidian/Target/#obsidian-heading-0">heading</a>');
  expect(html('Target')).toContain('id="obsidian-heading-0"');
  expect(html('Source')).toContain('href="/notes/obsidian/Target/#obsidian-heading-2">nested</a>');
  expect(html('Target')).toContain('id="obsidian-heading-2"');
  expect(html('Source')).toContain('href="/notes/obsidian/Target/#obsidian-block-my-id">block</a>');
  expect(html('Target')).toContain('id="obsidian-block-my-id"');
  expect(html('Target')).not.toContain('^My-ID');
});

test('note and section embeds include only selected content, resolve links relative to the embedded note and terminate actual cycles', async () => {
  const { html, entries } = await load({
    'Source.md': publicNote('![[Folder/Target#Keep]]\n\n![[Folder/Target#^piece]]\n\n![[Secret]]'),
    'Folder/Target.md': publicNote('## Keep\n\nEMBED_VISIBLE [[./Other|local]]\n\n## Excluded\n\nSECTION_EXCLUDED\n\nBlock only ^piece\n\n![[Cycle]]'),
    'Folder/Other.md': publicNote('Other'), 'Secret.md': 'PRIVATE_BODY',
    'Cycle.md': publicNote('![[Folder/Target]]'),
  });
  expect(html('Source')).toContain('EMBED_VISIBLE');
  expect(html('Source')).toContain('href="/notes/obsidian/Folder/Other/">local</a>');
  expect(html('Source')).toContain('Block only');
  expect(html('Source')).not.toContain('SECTION_EXCLUDED');
  expect(html('Source')).not.toContain('PRIVATE_BODY');
  expect(entries.has('obsidian/Secret')).toBe(false);
  expect(html('Cycle')).toContain('SECTION_EXCLUDED');
  expect(html('Cycle')).toContain('href="/notes/obsidian/Cycle/"');
});

test('comments disappear before links or attachments are published while escaped markers and code remain literal', async () => {
  const { html, root } = await load({
    'Source.md': publicNote('Visible %%HIDDEN [[Target]] ![[hidden.png]]%% text\n\n%%\nBLOCK_HIDDEN\n\n![[hidden.png]]\n%%\n\n`%%inline code%%`\n\n```\n%%fenced code%%\n```\n\n\\%%literal\\%%'),
    'Target.md': publicNote('target'), 'hidden.png': 'secret image',
  });
  expect(html('Source')).not.toContain('HIDDEN');
  expect(html('Source')).not.toContain('/notes/obsidian/Target/');
  expect(html('Source')).toContain('<code>%%inline code%%</code>');
  expect(html('Source')).toContain('%%fenced code%%');
  expect(html('Source')).toContain('%%literal%%');
  await expect(readdir(join(root, 'public/_obsidian'))).rejects.toThrow();
});

test('highlight renders inline formatting and public links while escaped markers and inline code remain literal', async () => {
  const { html } = await load({ 'Source.md': publicNote('==**bright** [[Target|link]]== \\==literal\\== `==code==`'), 'Target.md': publicNote('target') });
  expect(html('Source')).toContain('<mark><strong>bright</strong> <a href="/notes/obsidian/Target/">link</a></mark>');
  expect(html('Source')).toContain('==literal==');
  expect(html('Source')).toContain('<code>==code==</code>');
});

test('soft line breaks render as breaks without changing math or code', async () => {
  const { html } = await load({ 'Source.md': publicNote('first\nsecond\n\n$x^2$\n\n```\na\nb\n```') });
  expect(html('Source')).toContain('first<br>\nsecond');
  expect(html('Source')).toContain('class="katex"');
  expect(html('Source')).toContain('<pre><code>a\nb\n</code></pre>');
});

test('callouts render formatted titles, nested content and native open or closed disclosure behavior', async () => {
  const { html } = await load({ 'Source.md': publicNote('> [!note]- **Title**\n> Body [[Target|link]]\n>\n> > [!tip]+\n> > Nested\n\n> [!warning]\n> Caution'), 'Target.md': publicNote('target') });
  expect(html('Source')).toContain('<details class="callout" data-callout="note">');
  expect(html('Source')).toContain('<summary class="callout-title"><strong>Title</strong></summary>');
  expect(html('Source')).toContain('href="/notes/obsidian/Target/">link</a>');
  expect(html('Source')).toMatch(/<details class="callout" data-callout="tip" open(?:="")?>/);
  expect(html('Source')).toContain('Nested');
  expect(html('Source')).toContain('data-callout="warning"');
  expect(html('Source')).not.toContain('[!');
});

test('task markers preserve custom states; every non-space state is checked', async () => {
  const { html } = await load({ 'Source.md': publicNote('- [ ] todo\n- [/] partial\n- [x] done\n- [-] cancelled') });
  expect(html('Source')).toMatch(/data-task=" ?"[^>]*>[\s\S]*?<input(?![^>]*checked)[^>]*type="checkbox"/);
  for (const state of ['/', 'x', '-']) {
    expect(html('Source')).toMatch(new RegExp(`data-task="${state}"[^>]*>[\\s\\S]*?<input[^>]*checked`));
  }
  expect(html('Source')).not.toContain('[/]');
});

test('referenced images support dimensions and native PDF/audio/video embeds publish only used attachments', async () => {
  const { html, root } = await load({
    'Source.md': publicNote('![[pic.png|320x200]]\n\n![[vector.svg|120]]\n\n![[doc.pdf#page=2]]\n\n![[song.mp3]]\n\n![[clip.mp4]]\n\n[download](doc.pdf)'),
    'pic.png': 'png bytes', 'vector.svg': '<svg xmlns="http://www.w3.org/2000/svg"></svg>', 'doc.pdf': '%PDF-1.4', 'song.mp3': 'audio', 'clip.mp4': 'video', 'unused.mp4': 'private',
  });
  expect(html('Source')).toMatch(/<img[^>]*width="320"[^>]*height="200"/);
  expect(html('Source')).toMatch(/<img[^>]*\.svg"[^>]*width="120"/);
  expect(html('Source')).toMatch(/<iframe[^>]*src="\/_obsidian\/[^" ]+\.pdf#page=2"/);
  expect(html('Source')).toMatch(/<audio[^>]*controls[^>]*src="\/_obsidian\/[^" ]+\.mp3"/);
  expect(html('Source')).toMatch(/<video[^>]*controls[^>]*src="\/_obsidian\/[^" ]+\.mp4"/);
  expect(html('Source')).toMatch(/<a href="\/_obsidian\/[^" ]+\.pdf">download<\/a>/);
  expect(await readdir(join(root, 'public/_obsidian'))).toHaveLength(5);
});

test('raw HTML is sanitized, keeps raw Markdown literal and uses the same publication rules for local links and media', async () => {
  const { html, root } = await load({
    'Source.md': publicNote('<div>**raw** <a href="Target.md">public</a> <a href="Secret.md">private</a><img src="raw.png" onerror="alert(1)"><script>alert(2)</script></div>\n\n<span class="custom">inline **bold**</span>'),
    'Target.md': publicNote('target'), 'Secret.md': 'PRIVATE', 'raw.png': 'raw image',
  });
  expect(html('Source')).toContain('**raw**');
  expect(html('Source')).toContain('<span class="custom">inline <strong>bold</strong></span>');
  expect(html('Source')).toContain('href="/notes/obsidian/Target/">public</a>');
  expect(html('Source')).not.toContain('href="Secret.md"');
  expect(html('Source')).not.toContain('alert(');
  expect(html('Source')).toMatch(/<img src="\/_obsidian\/[^" ]+\.png"/);
  expect(await readdir(join(root, 'public/_obsidian'))).toHaveLength(1);
});

test('Mermaid source is emitted for the client without SVG assets or a server renderer', async () => {
  const source = 'flowchart LR\n  A[Alpha] --> B[Beta]';
  const { html, root } = await load({ 'Source.md': publicNote('```mermaid\n' + source + '\n```\n\n```text\nA --> B\n```') });
  const { JSDOM } = await import('jsdom');
  const document = new JSDOM(html('Source')).window.document;
  expect(document.querySelector('pre[data-obsidian-mermaid]')?.textContent).toBe(source);
  expect(document.querySelector('svg')).toBeNull();
  await expect(readdir(join(root, 'public/_obsidian'))).rejects.toThrow();
  expect(html('Source')).toContain('<code class="language-text">A --&gt; B');
});

test('heading embeds retain reference links and footnotes whose definitions are outside the selected section', async () => {
  const { html } = await load({
    'Source.md': publicNote('![[Target#Keep]]'),
    'Target.md': publicNote('## Keep\n\n[reference][ref] footnote[^one]\n\n## End\n\nDO_NOT_EMBED\n\n[ref]: Other.md\n\n[^one]: Footnote content'),
    'Other.md': publicNote('other'),
  });
  expect(html('Source')).toContain('href="/notes/obsidian/Other/">reference</a>');
  expect(html('Source')).toContain('Footnote content');
  expect(html('Source')).not.toContain('DO_NOT_EMBED');
});

test('block embeds retain list descendants and standalone block IDs point to complete lists and tables', async () => {
  const { html } = await load({
    'Source.md': publicNote('![[Target#^item]]\n\n![[Target#^table]]\n\n[[Target#^list|whole list]]'),
    'Target.md': publicNote('- Parent ^item\n  - Child\n- Sibling\n\n^list\n\n| Head |\n| --- |\n| Cell |\n\n^table'),
  });
  expect(html('Source')).toContain('Parent');
  expect(html('Source')).toContain('Child');
  expect(html('Source')).not.toContain('Sibling');
  expect(html('Source')).toContain('<table>');
  expect(html('Source')).toContain('Cell');
  expect(html('Target')).toContain('id="obsidian-block-list"');
});

test('repeated embeds have distinct IDs and footnote links still reach their own targets', async () => {
  const { html } = await load({ 'Source.md': publicNote('# Host\n\n![[Target]]\n\n![[Target]]'), 'Target.md': publicNote('# Embedded\n\nText[^n]\n\n[^n]: Note') });
  const { JSDOM } = await import('jsdom');
  const document = new JSDOM(html('Source')).window.document;
  const ids = [...document.querySelectorAll('[id]')].map(element => element.id);
  expect(new Set(ids).size).toBe(ids.length);
  for (const link of document.querySelectorAll('a[href^="#"]')) expect(document.getElementById(decodeURIComponent(link.getAttribute('href')!.slice(1)))).not.toBeNull();
});

test('frontmatter only exposes YAML objects and ignores non-object or invalid YAML without publishing the header as body', async () => {
  const { entries, html } = await load({
    'Empty.md': '---\n---\nEmpty body',
    'Array.md': '---\n- one\n- two\n---\nArray body',
    'Invalid.md': '---\nbroken: [\n---\nInvalid body',
  }, () => true);
  for (const name of ['Empty', 'Array', 'Invalid']) expect(entries.get(`obsidian/${name}`)!.data).toEqual({ tags: [] });
  expect(html('Empty')).toBe('<p>Empty body</p>');
  expect(html('Array')).toBe('<p>Array body</p>');
  expect(html('Invalid')).toBe('<p>Invalid body</p>');
});

test('image dimension suffixes retain the descriptive alt text and explicit aspect ratio', async () => {
  const { html } = await load({ 'Source.md': publicNote('![[pic.png|Description|320x200]]\n\n![Description|120](pic.png)\n\n![Remote|80x40](https://example.com/image.png)'), 'pic.png': 'image' });
  expect(html('Source')).toMatch(/alt="Description"[^>]*width="320"[^>]*height="200"[^>]*style="aspect-ratio: 320 \/ 200"/);
  expect(html('Source')).toMatch(/alt="Description"[^>]*width="120"/);
  expect(html('Source')).toMatch(/src="https:\/\/example.com\/image.png" alt="Remote" width="80" height="40"/);
});

test('same-note Markdown subpaths resolve headings and blocks while website-style anchors remain usable', async () => {
  const { html } = await load({ 'Source.md': publicNote('## **Hello**, World!\n\nParagraph ^ID\n\n[heading](#Hello%20World) [block](#^id) [custom](#custom-anchor)') });
  expect(html('Source')).toContain('href="#obsidian-heading-0">heading</a>');
  expect(html('Source')).toContain('href="#obsidian-block-id">block</a>');
  expect(html('Source')).toContain('href="#custom-anchor">custom</a>');
});

test('unselected and missing link targets retain their entire display text, including formatted labels', async () => {
  const { html } = await load({ 'Source.md': publicNote('[**private** and `code`](Secret.md) [*missing*](Missing.md)'), 'Secret.md': 'PRIVATE_BODY' });
  expect(html('Source')).toContain('private and code');
  expect(html('Source')).toContain('missing');
  expect(html('Source')).not.toContain('<a');
});

test('footnotes inside callouts and task lists render definitions and keep working without duplicate footnote IDs', async () => {
  const { html } = await load({ 'Source.md': publicNote('> [!note]\n> Callout[^n]\n\n- [/] Task[^n]\n\n[^n]: Shared footnote') });
  const { JSDOM } = await import('jsdom');
  const document = new JSDOM(html('Source')).window.document;
  expect(document.querySelector('.callout')!.textContent).toContain('Shared footnote');
  expect(document.querySelector('.contains-task-list')!.textContent).toContain('Task');
  expect(html('Source')).not.toContain('[^n]');
  const ids = [...document.querySelectorAll('[id]')].map(element => element.id);
  expect(new Set(ids).size).toBe(ids.length);
  for (const link of document.querySelectorAll('a[data-footnote-ref]')) expect(document.getElementById(link.getAttribute('href')!.slice(1))).not.toBeNull();
});


test('resolution chooses the vault target before applying publication selection, including inside embeds', async () => {
  const { html, entries } = await load({
    'Source.md': publicNote('[[Target|private root]] ![[Target]] ![[Folder/Embed]]'),
    'Target.md': 'PRIVATE_ROOT_BODY',
    'Folder/Target.md': publicNote('PUBLIC_LOCAL_BODY'),
    'Folder/Embed.md': publicNote('[[Target|private from embed]] [[./Target|explicit local]]'),
  });
  expect(entries.has('obsidian/Target')).toBe(false);
  expect(html('Source')).toContain('private root');
  expect(html('Source')).toContain('private from embed');
  expect(html('Source')).not.toContain('PRIVATE_ROOT_BODY');
  expect(html('Source')).not.toContain('PUBLIC_LOCAL_BODY');
  expect(html('Source')).not.toMatch(/href="[^"]+">private/);
  expect(html('Source')).toContain('href="/notes/obsidian/Folder/Target/">explicit local</a>');
});


test('attachments respect the Astro deployment base in Markdown and raw HTML', async () => {
  const { html, root } = await load({
    'Source.md': publicNote('![[pic.png]]\n\n<img src="pic.png">\n\n[download](doc.pdf)'),
    'pic.png': 'image', 'doc.pdf': '%PDF',
  }, undefined, '/knowledge/');
  expect(html('Source')).toMatch(/src="\/knowledge\/_obsidian\/[^" ]+\.png"/);
  expect(html('Source')).toMatch(/href="\/knowledge\/_obsidian\/[^" ]+\.pdf"/);
  expect(html('Source')).not.toMatch(/(?:src|href)="\/_obsidian\//);
  expect(await readdir(join(root, 'public/_obsidian'))).toHaveLength(2);
});
