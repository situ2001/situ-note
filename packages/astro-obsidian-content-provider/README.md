# Astro Obsidian content provider

An Astro content loader for selected Markdown notes in an external Obsidian vault. The package handles vault scanning, frontmatter parsing, WikiLinks, publication-safe links, and referenced images. The consuming site decides which notes to publish, how to map their properties, and where their article routes live.

## Install

This repository uses a pnpm workspace:

```sh
pnpm install --frozen-lockfile
pnpm --filter @situ2001/astro-obsidian-content-provider build
```

The package declares Astro 7 as a peer dependency. It is packaged as compiled ESM and TypeScript declarations; it has not been published to npm.

When editing package source during site development, run `pnpm --filter @situ2001/astro-obsidian-content-provider dev` in another terminal to rebuild its output on changes.

## Configure an Astro collection

```ts
// src/content.config.ts
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { obsidianLoader } from '@situ2001/astro-obsidian-content-provider';

const notes = defineCollection({
  loader: obsidianLoader({
    vault: process.env.OBSIDIAN_VAULT,
    filter: ({ path, properties, tags }) =>
      properties.shared === true && path.startsWith('Publish/') && tags.includes('web'),
    mapProperties: ({ path, properties }) => ({
      ...properties,
      title: properties.title ?? path.split('/').pop()!.replace(/\.md$/, ''),
    }),
    url: (id) => `/notes/${id.split('/').map(encodeURIComponent).join('/')}/`,
  }),
  schema: z.object({ title: z.string(), date: z.string() }),
});

export const collections = { notes };
```

The loader assigns IDs beginning with `obsidian/` and passes mapped properties through Astro's collection schema. The consuming site owns its date schema; this blog requires quoted ISO timestamps with explicit timezones and converts them to `Date` values in `src/content.config.ts`. The `url(id)` callback must match the consuming site's article route so public WikiLinks resolve correctly. Only notes selected by `filter` are emitted. Links to unselected or missing notes become plain text.

The loader clears and rebuilds the collection and its `public/_obsidian/` attachment directory on each sync. It does not watch the external vault. One loader instance owns that directory; concurrent instances or builds sharing it are unsupported. Raw HTML and cross-note heading or block links currently fail. The repository's `docs/obsidian-provider.md` records the blog integration, supported syntax, and verification.
