import { test, expect } from 'vitest';
import { mkdtemp, mkdir, writeFile, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import type { LoaderContext } from 'astro/loaders';
import { obsidianLoader } from '@situ2001/astro-obsidian-content-provider';

// Real filesystem, YAML and Markdown AST. Astro store/schema/render are boundaries;
// the full build check covers their integration and the published HTML.
test('selection, private links, attachments, code and revocation', async () => {
  const root = await mkdtemp(join(tmpdir(), 'obsidian-provider-'));
  const vault = join(root, 'vault');
  await mkdir(join(vault, 'Publish'), { recursive: true });
  const entries = new Map<string, any>();
  const context = {
    store: { clear: () => entries.clear(), set: (entry: any) => entries.set(entry.id, entry) },
    parseData: async ({ data }: any) => data,
    renderMarkdown: async (body: string) => ({ html: body }),
    config: { publicDir: pathToFileURL(join(root, 'public') + '/') },
    logger: { info() {} },
  } as unknown as LoaderContext;
  const loader = obsidianLoader({
    vault,
    filter: note => note.properties.shared === true && note.path.startsWith('Publish/') && note.tags.includes('web'),
    mapProperties: note => ({ title: note.properties.name }),
    url: id => `/blog/${id}/`,
  });
  try {
    await writeFile(join(vault, 'Publish/A.md'), '---\nshared: true\ntags: [web]\nname: Mapped title\n---\n[[B|visible]] [[Secret|private]] ![[Secret]] ![[image.png]]\n\n`[[Secret]]`\n\n```\n![[private.png]]\n```');
    await writeFile(join(vault, 'Publish/B.md'), '---\nshared: true\ntags: web\n---\nPublic B');
    await writeFile(join(vault, 'Secret.md'), 'PRIVATE BODY');
    await writeFile(join(vault, 'image.png'), 'image bytes');
    await writeFile(join(vault, 'private.png'), 'PRIVATE IMAGE');
    await loader.load(context);
    expect([...entries.keys()]).toEqual(['obsidian/Publish/A', 'obsidian/Publish/B']);
    expect(entries.get('obsidian/Publish/A').data.title).toBe('Mapped title');
    const body = entries.get('obsidian/Publish/A').body;
    expect(body).toContain('[visible](/blog/obsidian/Publish/B/)');
    expect(body).not.toContain('PRIVATE BODY');
    expect(body).not.toContain('](Secret)');
    expect(body).toContain('`[[Secret]]`');
    expect(body).toContain('![[private.png]]');
    expect(await readdir(join(root, 'public/_obsidian'))).toHaveLength(1);
    await writeFile(join(vault, 'Publish/A.md'), '---\nshared: false\n---\nWithdrawn');
    await loader.load(context);
    expect([...entries.keys()]).toEqual(['obsidian/Publish/B']);
    await expect(readdir(join(root, 'public/_obsidian'))).rejects.toThrow();
    // Full-vault index must see the private duplicate, rather than choose public B.
    await mkdir(join(vault, 'Other'));
    await writeFile(join(vault, 'Other/B.md'), 'Private duplicate');
    await mkdir(join(vault, 'Publish/Nested'));
    await writeFile(join(vault, 'Publish/Nested/C.md'), '---\nshared: true\ntags: [web]\n---\n[[B]]');
    await expect(loader.load(context)).rejects.toThrow('Ambiguous vault link');
    await writeFile(join(vault, 'Publish/Nested/C.md'), '---\nshared: true\ntags: [web]\n---\n<div>HTML probe</div>');
    await expect(loader.load(context)).rejects.toThrow('Raw HTML is not supported');
    await writeFile(join(vault, 'Publish/Nested/C.md'), '---\nshared: true\ntags: [web]\n---\n[[Publish/B#Heading]]');
    await expect(loader.load(context)).rejects.toThrow('Cross-note heading/block links');

  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkObsidianLinks from '../src/remark-obsidian-links';

test('wiki syntax takes precedence over same-name references and respects escapes/code', () => {
  const parser = unified().use(remarkParse).use(remarkObsidianLinks);
  const tree = parser.parse('[[Target]] ![[Target]]\n\n[Target]: https://example.com');
  expect(tree.children[0]).toMatchObject({ type: 'paragraph', children: [
    { type: 'link', url: 'Target', children: [{ type: 'text', value: 'Target' }] },
    { type: 'text', value: ' ' },
    { type: 'image', url: 'Target', alt: 'Target' },
  ] });
  const literal = parser.parse('`[[Target]]` \\[[Target]]');
  expect(literal.children[0]).toMatchObject({ type: 'paragraph', children: [
    { type: 'inlineCode', value: '[[Target]]' },
    { type: 'text', value: ' [[Target]]' },
  ] });
});
