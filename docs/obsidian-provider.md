# Experimental Obsidian Content Provider

The pnpm workspace contains a standalone package at `packages/astro-obsidian-content-provider/`. Its loader supplies selected external Markdown without copying notes into the blog source tree. This blog keeps the existing `blog` and `insight` collections and MDX workflow, adds a `vault` collection in `src/content.config.ts`, and combines queries in `src/features/blog/blog.ts`. The article template, home page, categories, and RSS feed use both sources. The package interface and a separate collection example are in its [README](../packages/astro-obsidian-content-provider/README.md).

## Run locally

```sh
pnpm install --frozen-lockfile
OBSIDIAN_VAULT='/absolute/path/to/test-vault' pnpm build
pnpm preview
```

Pass the environment variable to the build or dev process. Without it, only the blog's own content is built. This experiment performs a full sync; it does **not watch the external vault during development**. Rebuild or restart dev after changing a note. It has only been verified with a test vault, and no deployment flow is configured.

Minimum note properties:

```yaml
---
shared: true
date: "2026-09-20T00:00:00+08:00"
title: Example article
tags: [Obsidian]
---
```

Only the boolean `shared: true` selects a note. `date` must be a quoted ISO timestamp with an explicit timezone, as required by the blog's publication-date schema. A date-only value such as `2026-09-20` fails validation. Publication dates display in UTC+8, and routes and RSS keep the original instant without a manual eight-hour adjustment. The title defaults to the filename, the description to an empty string, and categories to the frontmatter tags joined together or `Notes`. The custom mapping is in `src/content.config.ts`.

Article URLs follow `/blog/obsidian/<vault-relative-path-without-.md>/`. Moving or renaming a file changes its URL. A collision with an existing blog slug fails the build. Other themes can adapt the route with the loader's `url(id)` callback.

The filter callback can combine properties, frontmatter tags, and directory location. For example:

```ts
filter: ({ path, properties, tags }) =>
  properties.shared === true &&
  path.startsWith('Publish/') &&
  tags.includes('web')
```

`tags` does not scan inline tags in the note body. `mapProperties(note)` maps fields, and the resulting data must still pass the consuming collection's schema.

## Current support and limits

- Supports Markdown, aliased WikiLinks, ordinary and reference-style links, and images. Code blocks and inline code are left unchanged. The blog's remark-math/KaTeX pipeline still renders equations.
- Resolves links relative to the source file first, then relative to the vault, then by a unique path suffix or filename. Ambiguous matches fail. The index includes unpublished notes, but this is not a complete reproduction of Obsidian's resolution rules.
- Converts links to private or missing targets and unsupported embeds to text; it does not load the body of an embedded note. Cross-note heading and block links currently fail. Same-page `#anchor` links remain intact.
- Publishes PNG, JPEG, GIF, WebP, and AVIF files referenced by public notes. Attachments are named by content hash and are not optimized. Unreferenced images are not copied. SVG, video, PDF, image sizing parameters, note embeds, and Obsidian plugin syntax are not implemented.
- Preserves external links. Raw HTML in vault notes currently fails so it cannot bypass link and attachment handling. MDX in the vault, hidden directories, and symlinks are not loaded. The blog's existing MDX content is unaffected.
- The loader exclusively owns `public/_obsidian/` and deletes and rebuilds it on every sync. Only one instance is configured; multiple instances cannot share that directory. Astro build clears the old `dist` before producing new output, so withdrawing content requires a rebuild. Nothing has been deployed remotely.
- Do not publish the output of a failed build. Do not run another build or dev process that shares this public directory during a build or verification.

## Verification

```sh
pnpm astro sync
pnpm type-check
pnpm test --run
pnpm verify:obsidian
```

`packages/astro-obsidian-content-provider/test/obsidian.test.ts` exercises the packaged loader, filesystem, and Markdown/YAML processing while replacing the Astro store, schema, and rendering boundaries. It checks combined filtering, field mapping, private links, the attachment allowlist, code preservation, withdrawal cleanup, and ambiguous names.

`verify:obsidian` copies `test/fixtures/obsidian-vault` to a temporary external directory and runs two real Astro builds: first publishing, then withdrawing the notes. It checks that existing blog articles remain, that new pages, equations, links, images, and RSS work, that private bodies and attachments do not appear in `dist`, and that withdrawn pages, text, and attachments disappear. It keeps temporary build logs and output for inspection. The command updates Astro's local content cache; rebuild as shown above before a normal preview.

The experiment began from blog commit `d276a01f04275ed7579368f7fa3716ef0e83d32a` on Astro 5.18.1 and has since been merged and verified with Astro 7.3.4. It has not been tested with a real private vault, every Obsidian syntax feature, live watching, or remote deployment.

## Expanded Markdown and LaTeX sample (2026-09-20)

The test vault's `Astro Provider Probe/Publish/中文 空格.md` is a comprehensive sample. `pixel.png` is now a 1600×900 PNG, shown through a Wiki image, a Markdown image, and an image inside a link.

- Standard Markdown: ATX headings 1–6 and Setext headings; bold, italic, and strikethrough; soft and hard line breaks; escapes and entities; horizontal rules; nested ordered and unordered lists; task checkboxes; nested blockquotes; aligned tables; inline, reference, and automatic links; same-page anchors; repeated references and multi-paragraph footnotes; inline, fenced, and indented code.
- LaTeX: inline equations and five display equations covering integrals, series, fractions, roots, Greek letters, vectors, `aligned`, matrices, `cases`, Chinese text, and long formulas. Output checks verify KaTeX markup and equation counts, the absence of `katex-error`, and that dollar signs inside code do not produce equations.
- Fix: the loader's initial AST parsing now uses remark-gfm to preserve task lists, tables, strikethrough, autolinks, and footnotes through serialization. Astro still performs the final rendering.
- Obsidian extension probes: callouts remain ordinary blockquotes; highlight and comment markers appear as plain text; note embeds retain only the filename; and Mermaid appears only as code. In particular, `%%注释%%` is **not hidden** and must not be treated as a privacy boundary when publishing.
- Isolated loader tests check rejection of raw HTML and cross-note heading or block links.

Further checks fixed a precedence conflict between WikiLinks and same-name Markdown reference definitions by using a real Markdown inline syntax extension instead of matching text nodes afterward. Escaped WikiLinks and code remain unchanged. In tables, write the alias separator as `[[Second\|公开目标]]` so GFM does not treat it as a column separator. Add a space after a bare URL or use an explicit link to prevent Chinese punctuation from becoming part of the address.
