import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { obsidian } from "../obsidian.config";
import { parsePublicationDate } from "./features/blog/publicationDate";

const blogSchema = z.object({
    title: z.string(),
    // Quoted ISO timestamps retain their written timezone through YAML parsing.
    date: z.string().transform(parsePublicationDate),
    description: z.string(),
    categories: z.string(),
    // optional
    comments: z.boolean().optional(), // Enable comments on this post
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
});
const blog = defineCollection({
  loader: glob({ pattern: ["**/*.{md,mdx}", "!**/_templates/**"], base: "./src/content/blog" }),
  schema: blogSchema,
});

const vault = defineCollection({
  loader: obsidian.loader(),
  schema: blogSchema,
});

const insight = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/insight" }),
  schema: z.object({
    no: z.number().int(),
    title: z.string(),
    date: z.coerce.date(),
    heroImage: z.string().optional(),
  }),
});

export const collections = { blog, insight, vault };
