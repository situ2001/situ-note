import { getCollection } from "astro:content";
import { createBlogCatalog } from "./catalog";

export type { Post } from "./catalog";

export const blog = createBlogCatalog([
  ...(await getCollection("blog")),
  ...(await getCollection("vault")),
]);
