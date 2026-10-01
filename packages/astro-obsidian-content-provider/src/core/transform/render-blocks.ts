import { visit } from 'unist-util-visit';
import type { Root, Parents, RootContent } from 'mdast';

declare module 'mdast' { interface Data { obsidianTask?: string } }

export async function renderBlocks(tree: Root, render: (tree: Root) => Promise<string>) {
  async function walk(parent: Parents) {
    for (let index = 0; index < parent.children.length; index++) {
      const node = parent.children[index];
      if ('children' in node) await walk(node);
      if (node.type === 'list') {
        const tasks: string[] = [];
        visit(node, 'listItem', item => { if (item.data?.obsidianTask !== undefined) tasks.push(item.data.obsidianTask); });
        if (tasks.length) {
          let task = 0;
          const html = await render({ type: 'root', children: [node] });
          parent.children[index] = { type: 'html', value: html.replace(/<li class="task-list-item">/g, () => `<li class="task-list-item" data-task="${tasks[task++].replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')}">`) };
        }
      }
      if (node.type !== 'blockquote') continue;
      const first = node.children[0];
      const marker = first?.type === 'paragraph' ? first.children[0] : undefined;
      if (marker?.type !== 'text') continue;
      const match = marker.value.match(/^\[!([\w-]+)(?:\|[^\]]*)?\]([+-])?\s*/);
      if (!match) continue;
      const kind = match[1].toLowerCase();
      marker.value = marker.value.slice(match[0].length);
      const paragraph = first as Extract<RootContent, { type: 'paragraph' }>;
      const end = paragraph.children.findIndex(child => child.type === 'break');
      const titleNodes = end < 0 ? paragraph.children : paragraph.children.slice(0, end);
      const title = titleNodes.some(child => child.type !== 'text' || child.value)
        ? (await render({ type: 'root', children: [{ type: 'paragraph', children: titleNodes }] })).trim().replace(/^<p>|<\/p>$/g, '')
        : kind.replace(/-/g, ' ').replace(/^./, letter => letter.toUpperCase());
      const children = node.children.slice(1);
      if (end >= 0) children.unshift({ type: 'paragraph', children: paragraph.children.slice(end + 1) });
      const content = await render({ type: 'root', children });
      const value = match[2]
        ? `<details class="callout" data-callout="${kind}"${match[2] === '+' ? ' open' : ''}><summary class="callout-title">${title}</summary><div class="callout-content">${content}</div></details>`
        : `<aside class="callout" data-callout="${kind}"><div class="callout-title">${title}</div><div class="callout-content">${content}</div></aside>`;
      parent.children[index] = { type: 'html', value };
    }
  }
  await walk(tree);
}
