# Astro Obsidian content provider

Publish selected notes from an external Obsidian vault through Astro's Content Layer. Configure publication rules once, then connect the content loader, browser runtime, and RSS helper to your site.

Your site supplies the collection schema, article routes, layouts, styles, and feed metadata. This version supports one vault and one collection.

## Install

Requires Node 22.12+ and Astro `^7.3.4`. The package is distributed locally as a tarball and has not been published to npm.

From this package directory:

```sh
pnpm install
pnpm pack --pack-destination /path/to/artifacts
```

Packing builds the JavaScript and TypeScript declarations. In the consuming Astro project:

```sh
pnpm add /path/to/artifacts/situ2001-astro-obsidian-content-provider-0.1.0.tgz
```

## Configure once

Create a shared configuration module at the project root. Keep its imports usable from both Astro configuration and content configuration; `astro:content` belongs in the collection or page modules.

```ts
// obsidian.config.ts
import { createObsidian } from '@situ2001/astro-obsidian-content-provider';

export const obsidian = createObsidian({
  vault: process.env.OBSIDIAN_VAULT,
  filter: ({ properties }) => properties.shared === true,
  mapProperties: ({ path, properties }) => ({
    ...properties,
    title: properties.title ?? path.split('/').pop()!.replace(/\.md$/, ''),
  }),
  url: id => `/notes/${id.split('/').map(encodeURIComponent).join('/')}/`,
});
```

Register the integration and collection:

```ts
// astro.config.ts
import { defineConfig } from 'astro/config';
import { obsidian } from './obsidian.config';

export default defineConfig({ integrations: [obsidian.integration()] });
```

```ts
// src/content.config.ts
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { obsidian } from '../obsidian.config';

export const collections = {
  notes: defineCollection({
    loader: obsidian.loader(),
    schema: z.object({ title: z.string() }),
  }),
};
```

Set `OBSIDIAN_VAULT` to your vault directory. With this example, a note containing `shared: true` in its frontmatter becomes a collection entry. Render entries in your article routes using Astro's `getCollection` / `getEntry` and `render` APIs.

| Option | Contract |
| --- | --- |
| `vault` | Vault directory. Omitting it produces an empty collection. |
| `filter(note)` | Selects notes for publication. Receives the vault-relative `path`, YAML `properties`, and normalized `tags`. |
| `select({ notes, graph })` | Alternative to `filter`. Returns an iterable of notes to publish, synchronously or asynchronously. |
| `mapProperties(note)` | Returns data validated by your collection schema. YAML dates remain strings; convert them in your schema as needed. |
| `url(id)` | Returns the article URL used by links and RSS. It must match your site's routes. IDs are `obsidian/` followed by the vault-relative path without `.md`. |

Links and embeds only expose selected notes. Resolution searches the complete vault before applying the publication rule; a private target does not redirect to a different public note with the same name. Missing or unselected targets become display text.

## Selecting related notes

Provide exactly one of `filter` or `select`. Use `select` when publication depends on relationships between notes:

```ts
select: ({ notes, graph }) => {
  const roots = notes.filter(note => note.properties.shared === true);
  const related = graph.outgoing(roots).filter(
    note => note.properties.visibility === 'public',
  );
  return [...roots, ...related];
},
```

`notes` contains the whole vault's Markdown notes with `path`, `properties`, and `tags`. `graph.outgoing(notes)` returns direct targets; `graph.incoming(notes)` returns notes referencing the supplied notes. Both return unique notes in vault-path order. Queries include selected and unselected notes, so the callback controls which related notes become public.

The graph resolves WikiLinks, note embeds, Markdown links and reference links using the same parser and vault resolver as rendering. Heading and block references resolve to their containing note. Comments, code, external URLs, attachments and unresolved links do not add edges. Raw HTML links are not included in graph queries.

Return notes from this context; selection is matched by vault-relative path and deduplicated. The loader renders only the returned set, without recursively publishing further neighbors. Returning an empty iterable withdraws every note. Graph queries support selection; they do not add a backlinks widget to pages.

## Rendering and styles

Supported content includes WikiLinks, heading and block references, selected-note embeds, comments, highlights, callouts, task states, image dimensions, native PDF/audio/video attachments, and sanitized HTML. Rendering uses your Astro Markdown processor, including configured math and highlighting plugins.

The integration installs a small browser entry on every page. Pages containing Mermaid blocks load the bundled renderer on demand, including after ClientRouter navigation. Mermaid runs in strict security mode; builds require no Chromium or Playwright. Without JavaScript, diagrams remain readable as source code. Diagram syntax errors are reported in the browser.

Style the generated elements in your theme:

- `.callout[data-callout]`, `.callout-title`, and `.callout-content`
- `.obsidian-embed` and `.obsidian-pdf`
- `pre[data-obsidian-mermaid]`

The package ships no default CSS. It preserves explicit image dimensions, and Mermaid supplies its SVG presentation.

For manual client installation, use `obsidianLoader(options)` for the collection and import the client from a processed Astro script:

```astro
<script>
  import '@situ2001/astro-obsidian-content-provider/client';
</script>
```

## RSS content

In your feed route, use the shared configuration to convert a loaded entry into RSS HTML:

```ts
const content = obsidian.rssContent(entry, { site: context.site });
```

Pass the returned string as an RSS item's `content`, for example with `@astrojs/rss`. The helper requires `entry.rendered.html`. It sanitizes the HTML, resolves links and images against the configured article URL, and preserves working footnote references. Mermaid remains source code; audio, video, and PDF embeds retain their resource links.

Your feed route selects and orders entries, maps title/date/category fields, and supplies feed metadata. Set Astro's `site` URL when using `context.site`.

## Content lifecycle

Each loader sync rebuilds the collection and its owned `_obsidian/` directory beneath Astro's `publicDir`. Attachment URLs respect Astro's `base`. Only referenced attachments are copied; withdrawing a note removes its unused attachments on the next sync.

Restart Astro or rebuild after changing vault content: external-vault watching is not implemented. Use one loader instance and avoid concurrent builds that share the attachment directory.

## Development

From this package directory:

```sh
pnpm build
pnpm type-check
pnpm test
```

`pnpm dev` rebuilds TypeScript on changes. Production builds clean the output directory and emit ESM and declarations.

Loader tests use temporary vaults and a real Markdown renderer. The integration test installs the packed tarball into a separate Astro project and checks a different schema, subpath deployment, client injection, and RSS output. It requires npm and pnpm and may access the package registry.

```text
src/
  config.ts          Shared configuration and public methods
  rss.ts             Feed HTML conversion
  types.ts           Public note and loader options
  core/
    vault.ts         Vault reading and frontmatter
    resolve.ts       Obsidian path resolution
    assets.ts        Attachment publication
    transform/       Obsidian document semantics
  astro/
    loader.ts        Content Store and rendering lifecycle
    integration.ts   Browser entry and server dependency configuration
  client/index.ts    Lazy Mermaid rendering and page navigation
```
