export interface VaultNote {
  /** POSIX path relative to the vault, including .md. */
  path: string;
  properties: Record<string, unknown>;
  tags: string[];
}
export interface NoteGraph {
  /** Unique direct Markdown link/embed targets, in vault order. */
  outgoing(notes: Iterable<VaultNote>): VaultNote[];
  /** Unique notes linking to or embedding the supplied notes, in vault order. */
  incoming(notes: Iterable<VaultNote>): VaultNote[];
}
export interface NoteSelection {
  notes: VaultNote[];
  graph: NoteGraph;
}
interface BaseOptions {
  vault?: string;
  mapProperties: (note: VaultNote) => Record<string, unknown>;
  /** Return the URL used by the consuming site's article route. */
  url: (id: string) => string;
}

/** Choose one publication policy; selection never implicitly publishes neighbors. */
export type ObsidianLoaderOptions = BaseOptions & (
  | { filter: (note: VaultNote) => boolean; select?: never }
  | { filter?: never; select: (context: NoteSelection) => Iterable<VaultNote> | Promise<Iterable<VaultNote>> }
);
