import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  // Type-check frontmatter using a schema
  schema: z.object({
    title: z.string(),
    comments: z.boolean(), // Enable comments on this post
    // Transform string to Date object
    date: z.coerce.date(),
    description: z.string(),
    categories: z.string(),
    // optional
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
  }),
});

export const collections = { blog };
