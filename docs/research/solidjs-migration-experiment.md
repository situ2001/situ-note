# SolidJS migration experiment

Date: 2026-09-24. Delivery branch: `feat/solidjs-replacement`. The measurements came from the equivalent migration in the original experiment worktree.

## Result

Replacing React with SolidJS and removing React-specific packages reduced the locally built home page's reachable JavaScript from **77,444 to 19,808 gzip bytes (74.4%)** before opening search. Opening search brings the totals to **80,963 and 22,868 gzip bytes (71.8%)**, respectively.

| Route and import scope | React baseline | Solid experiment | Change |
| --- | ---: | ---: | ---: |
| Home, initial static imports | 77,444 B | 19,808 B | −74.4% |
| Home, including lazy search modal | 80,963 B | 22,868 B | −71.8% |
| Temperature chart article, static imports | 80,915 B | 23,077 B | −71.5% |
| Temperature chart article, all dynamic imports | 464,028 B | 406,052 B | −12.5% |

The chart article loads the large `@antv/g2` bundle when its chart mounts. Its “static imports” number therefore understates what a reader is likely to download. The “all dynamic imports” number includes the search modal even if the reader never opens it. The chart library dominates this route, so removing React has a smaller percentage effect there.

The home page HTML increased from 6,451 to 7,056 gzip bytes, mainly because the navigation islands serialize SVG icon markup as props. Even counting that increase, the home page's measured local JS plus HTML falls from 83,895 to 26,864 gzip bytes. These figures exclude images, CSS, third-party scripts, inline scripts, HTTP headers, cache reuse, and runtime network requests by Pagefind.

## Method

1. Created a fresh worktree from `main` using `herdr worktree create`.
2. Installed the existing lockfile and ran the unchanged `pnpm build` in that worktree.
3. Saved the baseline output from `node scripts/measure-js.mjs dist index.html blog/index.html blog/so-many-fever-in-2023/index.html` before changing code.
4. Replaced the Astro React integration with the Solid integration, ported the hydrated components, replaced React-only icon packages with trusted local SVG markup, and removed direct React dependencies.
5. Ran the same production build and measurement command again. The script starts at each page's local `<script src>`, `component-url`, and `renderer-url` references, recursively follows static imports, and optionally follows dynamic imports. Each reached file is counted once and gzip-compressed individually with Node's `gzipSync`.

This is a **migration comparison**, not an isolated React-runtime-versus-Solid-runtime benchmark. The change also removes React Compiler and Framer Motion, replaces icon imports, and passes only the required navigation data to the hydrated component. It establishes what this specific migration does to the built files. It does not establish a change in Core Web Vitals, interaction latency, or mobile CPU time.

## Validation

- `pnpm build` passes, including TypeScript checks and all 84 static routes.
- `pnpm exec vitest run` passes: 5 files, 8 tests. The server-rendered date test now uses Solid's renderer.
- Chrome preview: home and article render; search opens by button and `⌘K`, loads results for `astro`, navigates to a result, works after navigation, and closes with Escape. Project cards render on `/projects`. The temperature article renders three chart canvases, and clicking an article image creates the medium-zoom overlay.
- `pnpm why react` and `pnpm why react-dom` return no installed dependency path. No React import remains in application source; the changelog still mentions the historical React Compiler change.

The visual and browser checks covered common routes and search. The chart and image zoom checks establish that they mount and respond, but do not exhaustively check every chart interaction or navigation lifecycle.

## Implementation notes

Astro supports Solid components with server rendering and selective client hydration ([Astro Solid integration](https://docs.astro.build/en/guides/integrations-guide/solid-js/)). Existing static TSX components now render through Solid without client directives. The shared navigation, search, chart, and image zoom use Solid lifecycle APIs. Icons come from the framework-independent Carbon SVG assets and four local Bootstrap SVGs originally rendered from the site's existing `react-icons` components. The unchanged Pagefind search session remains framework-independent.

The emitted chart bundle is still the largest JavaScript opportunity for that article. For sitewide pages, the migration already removes most reachable JavaScript; further savings would likely require shrinking the hydrated navigation/search island or changing Astro's client router behavior.
