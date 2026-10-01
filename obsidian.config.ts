import { createObsidian } from "@situ2001/astro-obsidian-content-provider";

export const obsidian = createObsidian({
  vault: process.env.OBSIDIAN_VAULT,
  filter: ({ properties }) => properties.shared === true,
  mapProperties: ({ path, properties, tags }) => ({
    ...properties,
    title: properties.title ?? path.split('/').pop()!.replace(/\.md$/, ''),
    description: properties.description ?? '',
    categories: properties.categories ?? (tags.join(',') || 'Notes'),
  }),
  url: id => `/blog/${id.split('/').map(encodeURIComponent).join('/')}/`,
});
