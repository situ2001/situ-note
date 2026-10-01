import { afterEach, expect, test } from 'vitest';
import { readFile, realpath, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { buildSite } from './helpers/site';

const roots: string[] = [];
afterEach(async () => { await Promise.all(roots.splice(0).map(root => rm(root, { recursive: true, force: true }))); });

test('shared configuration installs the client and publishes semantic HTML without default styles', async () => {
  const { root, html, assets, clientFiles } = await buildSite(root => roots.push(root));
  expect(html).toContain('Mapped heading');
  expect(html).toContain('Published callout');
  expect(html).toContain('data-obsidian-mermaid');
  expect(html).toMatch(/<script[^>]*type="module"[^>]*src=/);
  const css = (await Promise.all(assets.filter(name => name.endsWith('.css')).map(name => readFile(join(root, 'dist/_astro', name), 'utf8')))).join('\n');
  expect(html + css).not.toContain('--obsidian-callout-border');
  expect(html + css).not.toMatch(/\.callout(?:\[|\s|\{)/);
  expect(await realpath(join(root, 'node_modules/@situ2001/astro-obsidian-content-provider'))).toContain(root);
  expect(html).toMatch(/src="\/knowledge\/_obsidian\/[^" ]+\.svg"/);
  const feed = await readFile(join(root, 'dist/feed.xml'), 'utf8');
  expect(feed).toContain('Independent feed');
  expect(feed).toContain('https://example.org/knowledge/_obsidian/');
  expect(feed).toContain('https://example.org/knowledge/#');
  expect(feed).toContain('Footnote content');
  expect(feed).toContain('Alpha');
  expect(feed).not.toContain('PRIVATE_NOTE_SENTINEL');
  const client = clientFiles.join('\n');
  expect(client).toContain('data-obsidian-mermaid');
  expect(client).toContain('astro:page-load');
  expect(client).not.toContain('SERVER_CONFIG_SENTINEL');
  expect(client).not.toContain('PRIVATE_NOTE_SENTINEL');
  expect(client).not.toContain(join(root, 'vault'));
}, 120_000);
