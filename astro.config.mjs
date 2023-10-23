import { defineConfig } from "astro/config";

import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://situ2001.com",
  integrations: [mdx(), sitemap()],
  image: {
    service: {
      entrypoint: "src/api/image.ts",
    },
  },
});
