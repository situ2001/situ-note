import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

/**
 * https://astro.build/config
 *
 * @type {import('astro/types').AstroConfig}
 */
export default defineConfig({
  site: "https://situ2001.com",
  integrations: [mdx(), sitemap(), tailwind(), react()],
  prefetch: true,
  image: {
    service: {
      entrypoint: "src/api/image.ts",
    },
  },
  markdown: {
    // TODO just copy from official doc, using blog-post.css now
    shikiConfig: {
      // Choose from Shiki's built-in themes (or add your own)
      // https://github.com/shikijs/shiki/blob/main/docs/themes.md
      themes:  {
        light: "github-light",
        dark: "github-dark",
      },
      // Alternatively, provide multiple themes
      // https://github.com/antfu/shikiji#lightdark-dual-themes
      experimentalThemes: {
        light: "github-light",
        dark: "github-dark",
      },
      // Add custom languages
      // Note: Shiki has countless langs built-in, including .astro!
      // https://github.com/shikijs/shiki/blob/main/docs/languages.md
      langs: [],
      // Enable word wrap to prevent horizontal scrolling
      wrap: false,
    },
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  },
  server: {
    host: true,
    port: 4321,
  },
  outDir: process.env['OUT_DIR'] || "./dist",
});
