import { readdir, readFile, mkdir, writeFile, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { parse as parseYaml } from 'yaml';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkObsidianLinks from './remark-obsidian-links.js';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkStringify from 'remark-stringify';
import { visit } from 'unist-util-visit';
import type { Root } from 'mdast';
import type { Loader } from 'astro/loaders';

export interface VaultNote {
  /** POSIX path relative to the vault, including .md. */
  path: string;
  properties: Record<string, unknown>;
  tags: string[];
}
export interface ObsidianLoaderOptions {
  vault?: string;
  filter: (note: VaultNote) => boolean;
  mapProperties: (note: VaultNote) => Record<string, unknown>;
  /** Return the URL used by the consuming site's article route. */
  url: (id: string) => string;
}
const processor = unified().use(remarkParse).use(remarkGfm).use(remarkMath).use(remarkObsidianLinks).use(remarkStringify);
const imageExtensions = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.avif']);
const external = /^(?:https?:|mailto:|tel:)/i;

async function filesIn(root: string, prefix = ''): Promise<string[]> {
  const result: string[] = [];
  for (const entry of await readdir(path.join(root, prefix), { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    const name = path.posix.join(prefix, entry.name);
    if (entry.isDirectory()) result.push(...await filesIn(root, name));
    else if (entry.isFile()) result.push(name); // Never follow symlinks out of the vault.
  }
  return result.sort();
}

/** Experimental provider: full rebuild on each Astro sync; no incremental/dev watching yet. */
export function obsidianLoader(options: ObsidianLoaderOptions): Loader {
  return {
    name: 'obsidian-provider',
    async load({ store, parseData, renderMarkdown, config, logger }) {
      store.clear();
      // This directory is exclusively owned by this loader. Rebuild the attachment allowlist.
      const assetDir = path.join(fileURLToPath(config.publicDir), '_obsidian');
      await rm(assetDir, { recursive: true, force: true });
      if (!options.vault) return;
      const vault = path.resolve(options.vault);
      const files = await filesIn(vault);
      const all = new Set(files);
      const notes = [];
      for (const file of files.filter(file => file.endsWith('.md'))) {
        const source = await readFile(path.join(vault, file), 'utf8');
        const match = source.match(/^\uFEFF?---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
        const properties = match ? parseYaml(match[1]) ?? {} : {};
        if (typeof properties !== 'object' || Array.isArray(properties)) throw new Error(`Invalid properties: ${file}`);
        const tags = (Array.isArray(properties.tags) ? properties.tags : typeof properties.tags === 'string' ? properties.tags.split(/[ ,]+/) : []).map(String).map((tag: string) => tag.replace(/^#/, ''));
        const note: VaultNote = { path: file, properties, tags };
        notes.push({ ...note, body: match ? source.slice(match[0].length) : source, id: `obsidian/${file.slice(0, -3)}` });
      }
      // Build the resolution index from ALL files, not only the public subset.
      const published = new Map(notes.filter(options.filter).map(note => [note.path, note]));
      function resolve(target: string, source: string): string | undefined {
        const decoded = decodeURIComponent(target);
        const variants = (p: string) => [p, `${p}.md`];
        const relative = path.posix.normalize(path.posix.join(path.posix.dirname(source), decoded));
        const exact = variants(relative).find(p => all.has(p)) ?? variants(decoded).find(p => all.has(p));
        if (exact) return exact;
        const candidates = files.filter(p => variants(decoded).some(v => p === v || p.endsWith(`/${v}`)));
        if (candidates.length > 1) throw new Error(`Ambiguous vault link in ${source}: ${target}`);
        return candidates[0];
      }
      const assets = new Map<string, Buffer>();
      for (const note of published.values()) {
        const tree = processor.parse(note.body);
        // Do not permit raw HTML to bypass the link/attachment allowlist.
        visit(tree, 'html', () => { throw new Error(`Raw HTML is not supported in vault notes: ${note.path}`); });
        // Expand reference links/images before applying the same publication policy.
        const definitions = new Map<string, { url: string; title?: string | null }>();
        visit(tree, 'definition', node => { definitions.set(node.identifier, { url: node.url, title: node.title }); });
        visit(tree, (node, index, parent) => {
          if ((node.type !== 'linkReference' && node.type !== 'imageReference') || !parent || index === undefined) return;
          const def = definitions.get(node.identifier);
          if (!def) throw new Error(`Missing link definition in ${note.path}`);
          parent.children[index] = (node.type === 'linkReference'
            ? { type: 'link', ...def, children: node.children }
            : { type: 'image', ...def, alt: node.alt });
        });
        const tasks: Promise<void>[] = [];
        visit(tree, (node, index, parent) => {
          if ((node.type !== 'link' && node.type !== 'image') || !parent || index === undefined) return;
          if (external.test(node.url)) return;
          if (node.url.startsWith('#') && node.type === 'link') return;
          const target = resolve(node.url.split('#')[0], note.path);
          const destination = target && published.get(target);
          if (node.type === 'link' && destination) {
            if (node.url.includes('#')) throw new Error(`Cross-note heading/block links are not supported yet: ${note.path}`);
            node.url = options.url(destination.id);
          } else if (node.type === 'image' && target && imageExtensions.has(path.extname(target).toLowerCase())) {
            tasks.push((async () => {
              const bytes = await readFile(path.join(vault, target));
              const name = createHash('sha256').update(bytes).digest('hex').slice(0, 24) + path.extname(target).toLowerCase();
              assets.set(name, bytes);
              node.url = `/_obsidian/${name}`;
            })());
          } else {
            parent.children[index] = { type: 'text', value: node.type === 'image' ? node.alt ?? '' : node.children.map(child => child.type === 'text' ? child.value : '').join('') };
          }
        });
        await Promise.all(tasks);
        tree.children = tree.children.filter(node => node.type !== 'definition');
        const body = processor.stringify(tree as Root);
        const data = await parseData({ id: note.id, data: options.mapProperties(note) });
        const rendered = await renderMarkdown(body);
        store.set({ id: note.id, data, body, rendered });
      }
      if (assets.size) await mkdir(assetDir, { recursive: true });
      for (const [name, bytes] of assets) await writeFile(path.join(assetDir, name), bytes);
      logger.info(`Loaded ${published.size} public notes and ${assets.size} referenced images`);
    },
  };
}
