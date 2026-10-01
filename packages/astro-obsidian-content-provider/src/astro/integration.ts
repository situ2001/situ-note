import type { AstroIntegration } from 'astro';

export function obsidianIntegration(): AstroIntegration {
  return {
    name: '@situ2001/astro-obsidian-content-provider',
    hooks: {
      'astro:config:setup': ({ injectScript, updateConfig }) => {
        // Preserve Node dependency resolution in both installed and linked packages.
        updateConfig({ vite: { resolve: { external: ['@situ2001/astro-obsidian-content-provider'] } } });
        injectScript('page', 'import "@situ2001/astro-obsidian-content-provider/client";');
      },
    },
  };
}
