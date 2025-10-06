import { getCollection, type CollectionEntry } from "astro:content";

export const insights = await getCollection('insight');

export type Insight = CollectionEntry<'insight'>;
