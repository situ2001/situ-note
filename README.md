# Situ Note

This is my personal website. Visit it at [https://situ2001.com](https://situ2001.com).

## Workspace

This repository uses pnpm workspaces. The Astro site is the root project, and the reusable Obsidian content loader is in [`packages/astro-obsidian-content-provider`](packages/astro-obsidian-content-provider/README.md). Run `pnpm install --frozen-lockfile` at the root; the site scripts build the package before using it. The package is not published to npm.

## How it deployed
