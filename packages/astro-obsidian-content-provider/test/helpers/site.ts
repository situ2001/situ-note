import { mkdtemp, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { promisify } from 'node:util';
import { execFile } from 'node:child_process';

const exec = promisify(execFile);
const require = createRequire(import.meta.url);
const packageRoot = fileURLToPath(new URL('../../', import.meta.url));

/** Install the actual tarball into an independent project, without workspace symlinks. */
export async function buildSite(onCreate: (root: string) => void) {
  const root = await mkdtemp(join(tmpdir(), 'obsidian-integration-'));
  onCreate(root);
  const packed = await exec('npm', ['pack', '--ignore-scripts', '--json', '--pack-destination', root], { cwd: packageRoot });
  const [{ filename }] = JSON.parse(packed.stdout);
  const files = {
    'package.json': JSON.stringify({
      private: true, type: 'module',
      dependencies: {
        '@situ2001/astro-obsidian-content-provider': `file:./${filename}`,
        astro: require('astro/package.json').version,
        '@astrojs/rss': require('@astrojs/rss/package.json').version,
      },
    }),
    'obsidian.config.ts': `import { createObsidian } from '@situ2001/astro-obsidian-content-provider';
export const obsidian = createObsidian({
  vault: new URL('./vault', import.meta.url).pathname,
  filter: note => note.properties.publish === 'web',
  mapProperties: () => ({ heading: 'Mapped heading', secret: 'SERVER_CONFIG_SENTINEL' }),
  url: () => '/knowledge/',
});`,
    'astro.config.mjs': `import { defineConfig } from 'astro/config';
import { obsidian } from './obsidian.config.ts';
export default defineConfig({ site: 'https://example.org', base: '/knowledge', integrations: [obsidian.integration()] });`,
    'src/content.config.ts': `import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { obsidian } from '../obsidian.config';
export const collections = { notes: defineCollection({ loader: obsidian.loader(), schema: z.object({ heading: z.string() }) }) };`,
    'src/pages/index.astro': `---
import { getEntry, render } from 'astro:content';
import { ClientRouter } from 'astro:transitions';
const note = await getEntry('notes', 'obsidian/Diagram');
const { Content } = await render(note!);
---
<html><head><ClientRouter /></head><body><h1>{note!.data.heading}</h1><Content /><a href="/knowledge/plain/">Plain</a></body></html>`,
    'src/pages/plain.astro': `---
import { ClientRouter } from 'astro:transitions';
---
<html><head><ClientRouter /></head><body><h1>Plain</h1><a href="/knowledge/">Diagram</a></body></html>`,
    'src/pages/feed.xml.ts': `import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { obsidian } from '../../obsidian.config';
export async function GET({ site }) {
  return rss({ site, title: 'Independent feed', description: 'Fixture', items: (await getCollection('notes')).map(entry => ({
    title: entry.data.heading, link: '/knowledge/', content: obsidian.rssContent(entry, { site }),
  })) });
}`,
    'vault/Diagram.md': '---\npublish: web\n---\n> [!note]\n> Published callout\n\nText[^n]\n\n[^n]: Footnote content\n\n![[image.svg]]\n\n```mermaid\ngraph LR\n Alpha --> Beta\n```',
    'vault/image.svg': '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><rect width="20" height="20" /></svg>',
    'vault/Private.md': 'PRIVATE_NOTE_SENTINEL',
  };
  for (const [name, content] of Object.entries(files)) {
    await mkdir(dirname(join(root, name)), { recursive: true });
    await writeFile(join(root, name), content);
  }
  // Resolve the tarball's declared dependencies as a consuming project would.
  await exec('pnpm', ['install', '--prefer-offline', '--ignore-scripts'], { cwd: root }).catch(error => {
    throw new Error([error.message, error.stdout, error.stderr].join('\n'));
  });
  await exec(process.execPath, [join(root, 'node_modules/astro/bin/astro.mjs'), 'build'], { cwd: root });
  const assets = await readdir(join(root, 'dist/_astro'));
  const html = await readFile(join(root, 'dist/index.html'), 'utf8');
  const clientFiles = await Promise.all(assets.filter(name => name.endsWith('.js')).map(name => readFile(join(root, 'dist/_astro', name), 'utf8')));
  return { root, html, assets, clientFiles };
}
