import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import prefectch from "@astrojs/prefetch";

import solidJs from "@astrojs/solid-js";

/**
 * https://astro.build/config
 *
 * @type {import('astro/types').AstroConfig}
 */
export default defineConfig({
  site: "https://situ2001.com",
  integrations: [mdx(), sitemap(), tailwind(), prefectch(), solidJs()],
  image: {
    service: {
      entrypoint: "src/api/image.ts",
    },
  },
});
