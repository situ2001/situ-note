import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

import tailwind from "@astrojs/tailwind";

import prefectch from "@astrojs/prefetch";

// https://astro.build/config
export default defineConfig({
  site: "https://situ2001.com",
  integrations: [mdx(), sitemap(), tailwind(), prefectch()],
  image: {
    service: {
      entrypoint: "src/api/image.ts",
    },
  },
});
