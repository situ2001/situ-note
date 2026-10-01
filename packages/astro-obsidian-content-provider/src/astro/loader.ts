import { rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Loader } from 'astro/loaders';
import type { ObsidianLoaderOptions } from '../types.js';
import { readVault } from '../core/vault.js';
import { createResolver } from '../core/resolve.js';
import { createAssets } from '../core/assets.js';
import { createTransformer } from '../core/transform/index.js';

/** Full rebuild on each Astro sync; one loader owns the published attachment directory. */
export function obsidianLoader(options: ObsidianLoaderOptions): Loader {
  return {
    name: 'obsidian-provider',
    async load({ store, parseData, renderMarkdown, config, logger }) {
      store.clear();
      const assetDir = path.join(fileURLToPath(config.publicDir), '_obsidian');
      await rm(assetDir, { recursive: true, force: true });
      if (!options.vault) return;

      const vault = path.resolve(options.vault);
      const { files, notes } = await readVault(vault);
      const published = new Map(notes.filter(options.filter).map(note => [note.path, note]));
      const assets = createAssets(vault, config.base);
      const transform = createTransformer({
        published, assets, resolve: createResolver(files), url: options.url, renderMarkdown,
      });
      for (const note of published.values()) {
        const data = await parseData({ id: note.id, data: options.mapProperties(note) });
        const { body, rendered } = await transform(note);
        store.set({ id: note.id, data, body, rendered });
      }
      await assets.write(assetDir);
      logger.info(`Loaded ${published.size} public notes and ${assets.size} referenced assets`);
    },
  };
}
