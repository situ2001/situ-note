import { expect, test } from 'vitest';
import { createObsidian } from '@situ2001/astro-obsidian-content-provider';

const obsidian = createObsidian({
  filter: () => true,
  mapProperties: note => note.properties,
  url: id => `/notes/${id}/`,
});

test('RSS uses rendered content and configured article URLs for resources and footnotes', () => {
  const content = obsidian.rssContent({
    id: 'obsidian/Article',
    rendered: { html: '<p>Published <a href="#fn-1">note</a> <a href="../Other/">other</a></p><img src="/_obsidian/image.png" alt="Picture"><img src="local.png"><p id="fn-1">Footnote</p><script>alert(1)</script>' },
  }, { site: new URL('https://example.org/') });
  expect(content).toContain('href="https://example.org/notes/obsidian/Article/#fn-1"');
  expect(content).toContain('href="https://example.org/notes/obsidian/Other/"');
  expect(content).toContain('src="https://example.org/_obsidian/image.png"');
  expect(content).toContain('src="https://example.org/notes/obsidian/Article/local.png"');
  expect(content).toContain('id="fn-1"');
  expect(content).toContain('Footnote');
  expect(content).not.toContain('alert(1)');
});

test('RSS retains Mermaid source, callout text and media links without executable content', () => {
  const content = obsidian.rssContent({ id: 'obsidian/Media', rendered: { html: `
    <details class="callout"><summary>Callout title</summary><p>Callout body</p></details>
    <pre data-obsidian-mermaid>graph LR\n A --&gt; B</pre>
    <audio controls src="/song.mp3"><a href="/song.mp3">Audio</a></audio>
    <video controls src="/clip.mp4"><a href="/clip.mp4">Video</a></video>
    <iframe src="/doc.pdf"></iframe><a href="/doc.pdf">PDF</a>
    <img src="/image.png" onerror="alert(1)"><a href="javascript:alert(2)">Unsafe</a>
  ` } }, { site: 'https://example.org' });
  expect(content).toContain('Callout title');
  expect(content).toContain('Callout body');
  expect(content).toContain('<pre>graph LR\n A --&gt; B</pre>');
  for (const file of ['song.mp3', 'clip.mp4', 'doc.pdf']) expect(content).toContain(`href="https://example.org/${file}"`);
  expect(content).not.toMatch(/<(?:iframe|audio|video|script)\b/);
  expect(content).not.toContain('alert(');
});
