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
