import { processor } from './parser.js';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { visit } from 'unist-util-visit';
import { cleanHtml, escapeHtml } from './html.js';
import { renderBlocks } from './render-blocks.js';
import { hideComments } from './comments.js';
import { indexSections, addAnchors } from './sections.js';
import type { Root, FootnoteDefinition, Nodes } from 'mdast';
import type { LoaderContext } from 'astro/loaders';
import type { SourceNote } from '../vault.js';
import type { createAssets } from '../assets.js';
import type { createResolver } from '../resolve.js';

const imageExtensions = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.avif', '.bmp', '.svg']);
const audioExtensions = new Set(['.mp3', '.wav', '.m4a', '.3gp', '.flac', '.ogg', '.oga', '.opus']);
const videoExtensions = new Set(['.mp4', '.webm', '.ogv', '.mov', '.mkv']);
const attachment = (file: string) => imageExtensions.has(path.extname(file).toLowerCase()) || audioExtensions.has(path.extname(file).toLowerCase()) || videoExtensions.has(path.extname(file).toLowerCase()) || path.extname(file).toLowerCase() === '.pdf';
const internal = (url: string) => url.startsWith('./') || url.startsWith('../') || !url.includes(':');
function displayText(node: Nodes): string {
  if ('children' in node) return node.children.map(displayText).join('');
  if ('alt' in node) return node.alt ?? '';
  return 'value' in node ? node.value : '';
}
function imageLabel(alt: string, fallback: string) {
  const size = alt.match(/(?:^|\|)(\d+)(?:x(\d+))?$/);
  const label = escapeHtml(size ? alt.slice(0, size.index) || fallback : alt);
  const dimensions = size ? ` width="${size[1]}"${size[2] ? ` height="${size[2]}" style="aspect-ratio: ${size[1]} / ${size[2]}"` : ''}` : '';
  return { label, dimensions };
}
function markdownUrl(url: string): string {
  // Obsidian leaves malformed URI escapes unchanged at this external text boundary.
  try { return decodeURI(url); } catch { return url; }
}

interface TransformContext {
  published: Map<string, SourceNote>;
  resolve: ReturnType<typeof createResolver>;
  assets: ReturnType<typeof createAssets>;
  url: (id: string) => string;
  renderMarkdown: LoaderContext['renderMarkdown'];
}

/** One transformation session owns document indexes and embed scopes for a load. */
export function createTransformer({ published, resolve, assets, url: noteUrl, renderMarkdown }: TransformContext): (note: SourceNote) => Promise<{ body: string; rendered: Awaited<ReturnType<LoaderContext['renderMarkdown']>> }> {
  const documents = new Map([...published.values()].map(note => {
    const source = hideComments(note.body, processor.parse(note.body));
    const tree = processor.parse(source);
    visit(tree, 'listItem', node => {
      const raw = source.slice(node.position!.start.offset!, node.position!.end.offset!);
      const match = raw.match(/^(?:[-+*]|\d+[.)])\s+\[(.)\](?=\s|$)/);
      if (!match) return;
      const first = node.children[0];
      const text = first?.type === 'paragraph' ? first.children[0] : undefined;
      if (node.checked == null && text?.type === 'text') text.value = text.value.replace(/^\[.\]\s*/, '');
      node.checked = match[1] !== ' ';
      node.data = { ...node.data, obsidianTask: match[1] };
    });
    return [note.path, { tree, sections: indexSections(tree, note.body) }];
  }));
  const publicUrls = new Set([...published.values()].flatMap(note => [noteUrl(note.id), encodeURI(noteUrl(note.id))]));
  async function clean(html: string, source: string, scope = '', footnotesOnly = false) {
    return cleanHtml(html, async (url, image) => {
      const [base] = url.split('#');
      if (url.startsWith('#') || !internal(url) || publicUrls.has(base) || assets.has(base)) return url;
      const target = resolve(markdownUrl(base), source);
      if (!target) return undefined;
      const destination = published.get(target);
      if (destination && !image) {
        const section = url.includes('#') ? documents.get(target)!.sections.resolve(markdownUrl(url.slice(url.indexOf('#') + 1))) : undefined;
        return noteUrl(destination.id) + (section ? `#${section.anchor}` : '');
      }
      if (attachment(target)) return await assets.publish(target) + (url.includes('#') ? url.slice(url.indexOf('#')) : '');
      return undefined;
    }, scope, footnotesOnly);
  }
  async function renderBody(note: SourceNote, input: Root, ancestry: string[]): Promise<string> {
    const tree = structuredClone(input);
    // Expand reference links/images before applying the same publication policy.
    const definitions = new Map<string, { url: string; title?: string | null }>();
    const original = documents.get(note.path)!.tree;
    visit(original, 'definition', node => { if (!definitions.has(node.identifier)) definitions.set(node.identifier, { url: node.url, title: node.title }); });
    const footnotes = new Map<string, FootnoteDefinition>();
    visit(original, 'footnoteDefinition', node => { footnotes.set(node.identifier, node); });
    tree.children = tree.children.filter(node => node.type !== 'footnoteDefinition');
    const needed = new Set<string>();
    visit(tree, 'footnoteReference', node => { needed.add(node.identifier); });
    for (const id of needed) {
      const definition = footnotes.get(id);
      if (!definition) continue;
      visit(definition, 'footnoteReference', node => { needed.add(node.identifier); });
      tree.children.push(structuredClone(definition));
    }
    visit(tree, (node, index, parent) => {
      if ((node.type !== 'linkReference' && node.type !== 'imageReference') || !parent || index === undefined) return;
      const def = definitions.get(node.identifier);
      if (!def) throw new Error(`Missing link definition in ${note.path}`);
      parent.children[index] = (node.type === 'linkReference'
        ? { type: 'link', ...def, children: node.children }
        : { type: 'image', ...def, alt: node.alt });
    });
    const tasks: Promise<void>[] = [];
    let embedSequence = 0;
    visit(tree, (node, index, parent) => {
      if ((node.type !== 'link' && node.type !== 'image') || !parent || index === undefined) return;
      if (!node.data?.obsidianWiki && !internal(node.url)) {
        if (node.type === 'image') {
          const { label, dimensions } = imageLabel(node.alt ?? '', node.alt ?? '');
          parent.children[index] = { type: 'html', value: `<img src="${escapeHtml(node.url)}" alt="${label}"${dimensions}${node.title ? ` title="${escapeHtml(node.title)}"` : ''}>` };
        }
        return;
      }
      if (!node.data?.obsidianWiki) node.url = markdownUrl(node.url);
      if (node.url.startsWith('#') && node.type === 'link' && !node.data?.obsidianWiki) {
        const section = documents.get(note.path)!.sections.resolve(node.url.slice(1));
        if (section) node.url = `#${section.anchor}`;
        return;
      }
      const target = resolve(node.url.split('#')[0], note.path);
      const destination = target && published.get(target);
      if (node.type === 'link' && destination) {
        const subpath = node.url.slice(node.url.indexOf('#') + 1);
        const section = node.url.includes('#') ? documents.get(target!)!.sections.resolve(subpath) : undefined;
        node.url = noteUrl(destination.id) + (section ? `#${section.anchor}` : '');
      } else if (node.type === 'image' && destination) {
        const subpath = node.url.includes('#') ? node.url.slice(node.url.indexOf('#') + 1) : '';
        const document = documents.get(target!)!;
        const section = subpath ? document.sections.resolve(subpath) : undefined;
        if ((subpath && !section) || ancestry.includes(target!)) {
          parent.children[index] = { type: 'link', url: noteUrl(destination.id), children: [{ type: 'text', value: node.alt ?? target! }] };
          return;
        }
        const scope = `embed-${createHash('sha256').update(ancestry.join('\0')).digest('hex').slice(0, 12)}-${embedSequence++}-`;
        tasks.push((async () => {
          const content = section ? { type: 'root' as const, children: section.nodes } : document.tree;
          const embedded = await renderBody(destination, content, [...ancestry, target!]);
          const rendered = await renderMarkdown(embedded);
          parent.children[index] = { type: 'html', value: `<div class="obsidian-embed">${await clean(rendered.html, destination.path, scope)}</div>` };
        })());
      } else if (target && attachment(target)) {
        tasks.push((async () => {
          const assetUrl = await assets.publish(target);
          const extension = path.extname(target).toLowerCase();
          const fragment = node.url.includes('#') ? node.url.slice(node.url.indexOf('#')) : '';
          const url = assetUrl + fragment;
          if (node.type === 'link') { node.url = url; return; }
          const { label, dimensions } = imageLabel(node.alt ?? '', target);
          const src = escapeHtml(url);
          const value = imageExtensions.has(extension) ? `<img src="${src}" alt="${label}"${dimensions}${node.title ? ` title="${escapeHtml(node.title)}"` : ''}>`
            : audioExtensions.has(extension) ? `<audio controls src="${src}"><a href="${src}">${label}</a></audio>`
            : videoExtensions.has(extension) ? `<video controls src="${src}"${dimensions}><a href="${src}">${label}</a></video>`
            : `<iframe class="obsidian-pdf" src="${src}" title="${label}" width="100%" height="600"></iframe><a href="${src}">${label}</a>`;
          parent.children[index] = { type: 'html', value };
        })());
      } else {
        parent.children[index] = { type: 'text', value: node.type === 'image' ? node.alt ?? '' : displayText(node) };
      }
    });
    visit(tree, 'code', (node, index, parent) => {
      if (node.lang !== 'mermaid' || !parent || index === undefined) return;
      parent.children[index] = { type: 'html', value: `<pre class="mermaid" data-obsidian-mermaid>${escapeHtml(node.value)}</pre>` };
    });
    await Promise.all(tasks);
    tree.children = tree.children.filter(node => node.type !== 'definition');
    visit(tree, 'text', (node, index, parent) => {
      if (!parent || index === undefined || !node.value.includes('\n')) return;
      const parts = node.value.split(/\r?\n/);
      parent.children.splice(index, 1, ...parts.flatMap((value, i) => i ? [{ type: 'break' as const }, { type: 'text' as const, value }] : [{ type: 'text' as const, value }]));
      return index + parts.length * 2 - 1;
    });
    addAnchors(tree);
    const definitionsForBlocks = tree.children.filter(node => node.type === 'footnoteDefinition');
    let blockSequence = 0;
    await renderBlocks(tree, async fragment => {
      const body = processor.stringify({ ...fragment, children: [...fragment.children, ...definitionsForBlocks] });
      return clean((await renderMarkdown(body)).html, note.path, `block-${blockSequence++}-`, true);
    });
    return processor.stringify(tree as Root);
  }
  return async (note: SourceNote) => {
    const body = await renderBody(note, documents.get(note.path)!.tree, [note.path]);
    const rendered = await renderMarkdown(body);
    rendered.html = await clean(rendered.html, note.path);
    return { body, rendered };
  };
}
