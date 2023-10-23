import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  site: "https://situ2001.com",
  integrations: [mdx(), sitemap(), tailwind()],
  image: {
    service: {
      entrypoint: "src/api/image.ts"
    }
  }
});