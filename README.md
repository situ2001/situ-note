# Situ Note

Personal website and blog at [situ2001.com](https://situ2001.com).

## Development

Use Node 22.12+ and pnpm 10.22.0. From the repository root:

```sh
pnpm install --frozen-lockfile
pnpm dev
```

The Astro site is the workspace root. Its scripts build the [Obsidian content provider](packages/astro-obsidian-content-provider/README.md) before starting Astro.

To include selected notes from an external vault:

```sh
OBSIDIAN_VAULT=/absolute/path/to/vault pnpm dev
```

[obsidian.config.ts](obsidian.config.ts) defines publication selection, field mapping, and article URLs. Notes with `shared: true` join the blog through the `vault` collection. Published notes need a quoted ISO `date` with an explicit timezone, such as `"2026-10-01T09:00:00+08:00"`; the [blog schema](src/content.config.ts) validates the mapped fields. Without `OBSIDIAN_VAULT`, the site uses its repository content.

## Checks and builds

```sh
pnpm test --run
pnpm type-check
pnpm build
pnpm verify:obsidian
```

`verify:obsidian` builds against a disposable test vault and checks publication, RSS, private-content exclusion, and withdrawal. It rebuilds and then removes `public/_obsidian/`; rebuild with your vault configured before previewing its attachments again.

The package's integration test installs a tarball into an independent Astro project and may access the package registry. See the [package README](packages/astro-obsidian-content-provider/README.md) for standalone installation and API usage.
