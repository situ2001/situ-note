export const isInternalUrl = (url: string) => url.startsWith('./') || url.startsWith('../') || !url.includes(':');

export function decodeMarkdownUrl(url: string): string {
  // Obsidian leaves malformed URI escapes unchanged at this external text boundary.
  try { return decodeURI(url); } catch { return url; }
}

/** Wiki targets are literal; Markdown targets classify protocols before decoding. */
export function parseVaultLink(url: string, wiki: boolean) {
  if (!wiki) {
    if (!isInternalUrl(url)) return undefined;
    url = decodeMarkdownUrl(url);
  }
  const hash = url.indexOf('#');
  return {
    url,
    path: hash < 0 ? url : url.slice(0, hash),
    subpath: hash < 0 ? undefined : url.slice(hash + 1),
  };
}
