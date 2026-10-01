import type { AstroIntegration } from 'astro';
import type { Loader } from 'astro/loaders';
import type { ObsidianLoaderOptions } from './types.js';
import { obsidianLoader } from './astro/loader.js';
import { obsidianIntegration } from './astro/integration.js';
import { renderRssContent, type RssEntry, type RssOptions } from './rss.js';

export type ObsidianOptions = ObsidianLoaderOptions;

/** Shared declarations; each loader invocation owns its own content state. */
export function createObsidian(options: ObsidianOptions): {
  loader(): Loader;
  integration(): AstroIntegration;
  rssContent(entry: RssEntry, options: RssOptions): string;
} {
  return {
    loader: () => obsidianLoader(options),
    rssContent: (entry, { site }) => renderRssContent(entry, new URL(options.url(entry.id), site)),
    integration: () => obsidianIntegration(),
  };
}
