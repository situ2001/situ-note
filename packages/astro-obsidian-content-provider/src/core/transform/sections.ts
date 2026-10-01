import { visit } from 'unist-util-visit';
import type { Root, RootContent, Heading } from 'mdast';

declare module 'mdast' { interface Data { obsidianAnchor?: string } }
const normalizeHeading = (value: string) => value.replace(/[!"#$%&()*+,.:;<=>?@^`{|}~\/\[\]\\\r\n]/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
export interface Section { anchor: string; nodes: RootContent[] }
export function indexSections(tree: Root, source: string) {
  const headings: { node: Heading; name: string; anchor: string }[] = [];
  const blocks = new Map<string, Section>();
  visit(tree, 'heading', node => {
    const raw = source.slice(node.position!.start.offset!, node.position!.end.offset!);
    const name = raw.replace(/^ {0,3}#{1,6}\s+/, '').replace(/\s+#+\s*$/, '').replace(/\n[=-]+\s*$/, '');
    const anchor = `obsidian-heading-${headings.length}`;
    node.data = { ...node.data, obsidianAnchor: anchor };
    headings.push({ node, name, anchor });
  });
  visit(tree, 'paragraph', (node, index, parent) => {
    const last = node.children.at(-1);
    if (last?.type !== 'text') return;
    const match = last.value.match(/(?:^|\s)\^([A-Za-z0-9-]+)\s*$/);
    if (!match) return;
    const id = match[1].toLowerCase();
    last.value = last.value.slice(0, match.index).trimEnd();
    const standalone = node.children.length === 1 && !last.value;
    const target = standalone && parent && index! > 0 ? parent.children[index! - 1] : parent?.type === 'listItem' ? parent : node;
    target.data = { ...target.data, obsidianAnchor: `obsidian-block-${id}` };
    blocks.set(id, { anchor: `obsidian-block-${id}`, nodes: [target as RootContent] });
  });
  return {
    resolve(subpath: string): Section | undefined {
      const parts = subpath.split('#').filter(Boolean);
      if (parts.length === 1 && parts[0].startsWith('^')) return blocks.get(parts[0].slice(1).toLowerCase());
      let part = 0, level = 0;
      for (let i = 0; i < headings.length; i++) {
        const heading = headings[i];
        if (heading.node.depth <= level || normalizeHeading(heading.name) !== normalizeHeading(parts[part] ?? '')) continue;
        level = heading.node.depth;
        if (++part !== parts.length) continue;
        const end = headings.slice(i + 1).find(item => item.node.depth <= level)?.node.position!.start.offset ?? Infinity;
        return { anchor: heading.anchor, nodes: tree.children.filter(node => node.position!.start.offset! >= heading.node.position!.start.offset! && node.position!.start.offset! < end) };
      }
    },
  };
}

export function addAnchors(tree: Root) {
  visit(tree, (node, index, parent) => {
    if (!node.data?.obsidianAnchor) return;
    const anchor = { type: 'html' as const, value: `<span id="${node.data.obsidianAnchor}"></span>` };
    if (node.type === 'heading' || node.type === 'paragraph') node.children.unshift(anchor);
    else if (node.type === 'listItem') {
      const first = node.children[0];
      if (first?.type === 'paragraph') first.children.unshift(anchor);
      else node.children.unshift({ type: 'paragraph', children: [anchor] });
    } else if (parent && index !== undefined) {
      parent.children.splice(index, 0, anchor);
      return index + 2;
    }
  });
}
