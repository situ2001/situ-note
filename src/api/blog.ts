import { getCollection, type CollectionEntry } from "astro:content";
import type { Dictionary } from "lodash";
import groupBy from "lodash/groupBy";

// init once, because it's a static collection
export const posts = await getCollection("blog");

export type Post = CollectionEntry<"blog">;

/// -------------- mapper functions --------------

export const convertToUTC8 = (post: Post) => ({
  ...post,
  data: {
    ...post.data,
    date: new Date(post.data.date.getTime() + -480 * 60000),
  },
});

export const covertToStaticPaths = (post: Post) => ({
  params: { slug: post.slug },
  props: post,
});

export const getPostSortedByDate = (posts: Post[], descending = true) => {
  // TODO use toSortedArray
  return posts.slice().sort((a, b) => {
    const dateA = a.data.date.valueOf();
    const dateB = b.data.date.valueOf();
    return descending ? dateB - dateA : dateA - dateB;
  });
};

/// -------------- api functions --------------

export const getTopKPosts = (posts: Post[], k: number) => {
  return getPostSortedByDate(posts).slice(0, k);
};

export const getStaticPaths = (posts: Post[]) => () => {
  return posts.map(convertToUTC8).map(covertToStaticPaths);
};

export const getPostsForRSS = (posts: Post[]) => {
  return getPostSortedByDate(posts).map(convertToUTC8);
};

/**
 * Group by categories, which is a string with comma separated
 * Notice that the category is flattened, so each post may appear multiple times
 * @returns
 */
export const getPostsGroupByCategory: (posts: Post[]) => Dictionary<Post[]> = (
  posts: Post[]
) => {
  const flattenCategoryPosts = posts.flatMap((post) => {
    return post.data.categories
      .split(",")
      .map((s) => s.trim())
      .map((category) => {
        return { ...post, data: { ...post.data, categories: category } };
      });
  });
  const c = groupBy(flattenCategoryPosts, (post) => post.data.categories);
  return c;
};

export const getCategoryStaticPaths = (groups: Dictionary<Post[]>) => () => {
  const categories = groups;
  return Object.keys(categories).map((category) => ({
    params: { category },
    props: { posts: categories[category].map(convertToUTC8), category },
  }));
};
