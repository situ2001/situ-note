import { visit } from 'unist-util-visit';
import { processor } from './transform/parser.js';
import { hideComments } from './transform/comments.js';
import type { SourceNote } from './vault.js';
import type { createResolver } from './resolve.js';
import type { NoteGraph, VaultNote } from '../types.js';

/** Direct resolved Markdown references; attachments and unresolved links are not notes. */
export function createNoteGraph(notes: SourceNote[], resolve: ReturnType<typeof createResolver>): NoteGraph {
  const paths = new Set(notes.map(note => note.path));
  const outgoing = new Map<string, Set<string>>();
  for (const note of notes) {
    const tree = processor.parse(hideComments(note.body, processor.parse(note.body)));
    const definitions = new Map<string, string>();
    visit(tree, 'definition', node => {
      if (!definitions.has(node.identifier)) definitions.set(node.identifier, node.url);
    });
    const targets = new Set<string>();
    visit(tree, node => {
      let url = node.type === 'link' || node.type === 'image' ? node.url
        : node.type === 'linkReference' || node.type === 'imageReference' ? definitions.get(node.identifier) : undefined;
      if (url === undefined) return;
      if (!node.data?.obsidianWiki) {
        if (!url.startsWith('./') && !url.startsWith('../') && url.includes(':')) return;
        // Match the transformer's handling of malformed escapes in external Markdown.
        try { url = decodeURI(url); } catch { /* Keep the original target. */ }
      }
      const target = resolve(url.split('#')[0], note.path);
      if (target && paths.has(target)) targets.add(target);
    });
    outgoing.set(note.path, targets);
  }
  return {
    outgoing(input: Iterable<VaultNote>) {
      const targets = new Set([...input].flatMap(note => [...outgoing.get(note.path)!]));
      return notes.filter(note => targets.has(note.path));
    },
    incoming(input: Iterable<VaultNote>) {
      const targets = new Set([...input].map(note => note.path));
      return notes.filter(note => [...outgoing.get(note.path)!].some(target => targets.has(target)));
    },
  };
}
