import { visit } from 'unist-util-visit';
import type { Root } from 'mdast';

/** Keep offsets intact for heading/block indexing; code and raw HTML own their contents. */
export function hideComments(source: string, tree: Root): string {
  const protectedRanges: [number, number][] = [];
  visit(tree, node => {
    if (['code', 'inlineCode', 'html', 'math', 'inlineMath'].includes(node.type)) {
      protectedRanges.push([node.position!.start.offset!, node.position!.end.offset!]);
    }
  });
  const spans: [number, number][] = [];
  for (let start = source.indexOf('%%'); start >= 0; start = source.indexOf('%%', start + 2)) {
    if (protectedRanges.some(([from, to]) => start >= from && start < to)) continue;
    const prefix = source.slice(0, start);
    if ((prefix.match(/\\+$/)?.[0].length ?? 0) % 2) continue;
    const end = source.indexOf('%%', start + 2);
    const isBlock = /^[ >\t]*$/.test(prefix.slice(prefix.lastIndexOf('\n') + 1));
    if (!isBlock && (end < 0 || source.slice(start, end).includes('\n'))) continue;
    const to = end < 0 ? source.length : end + 2;
    spans.push([start, to]);
    start = to - 2;
  }
  let result = source;
  for (const [start, end] of spans.reverse()) result = result.slice(0, start) + result.slice(start, end).replace(/[^\r\n]/g, ' ') + result.slice(end);
  return result;
}
