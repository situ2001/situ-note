import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkStringify from 'remark-stringify';
import remarkObsidianLinks from './remark-obsidian-links.js';
import remarkObsidianMark from './remark-obsidian-mark.js';
export const processor = unified().use(remarkParse).use(remarkGfm).use(remarkMath).use(remarkObsidianLinks).use(remarkObsidianMark).use(remarkStringify, {
  handlers: { strong(node, _parent, state, info) {
    const open = node.data?.obsidianMark ? '<mark>' : '**';
    const close = node.data?.obsidianMark ? '</mark>' : '**';
    return open + state.containerPhrasing(node, { ...info, before: open, after: close }) + close;
  } },
});
