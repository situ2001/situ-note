import sanitizeHtml from 'sanitize-html';

/** Structural input accepts any Astro collection containing loader-rendered HTML. */
export interface RssEntry {
  id: string;
  rendered?: { html: string };
}
export interface RssOptions {
  site: string | URL;
}

export function renderRssContent(entry: RssEntry, pageUrl: URL): string {
  if (!entry.rendered) throw new Error(`RSS requires rendered content for ${entry.id}`);
  return sanitizeHtml(entry.rendered.html, {
    allowedTags: [...sanitizeHtml.defaults.allowedTags, 'img', 'details', 'summary'],
    allowedAttributes: { ...sanitizeHtml.defaults.allowedAttributes, '*': ['id'] },
    transformTags: {
      '*': (tagName, attribs) => {
        for (const attribute of ['href', 'src']) {
          if (attribs[attribute]) attribs[attribute] = new URL(attribs[attribute], pageUrl).href;
        }
        return { tagName, attribs };
      },
    },
  });
}
