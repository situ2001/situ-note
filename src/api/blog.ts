import { getCollection, type CollectionEntry } from "astro:content";
import groupBy from "lodash/groupBy";

// init once, because it's a static collection
const posts = await getCollection("blog");

type Post = CollectionEntry<"blog">;

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

export const getPostSortedByDate = (descending = true) => {
  // TODO use toSortedArray
  return posts.slice().sort((a, b) => {
    const dateA = a.data.date.valueOf();
    const dateB = b.data.date.valueOf();
    return descending ? dateB - dateA : dateA - dateB;
  });
};

export const getTopKPosts = (k: number) => {
  return getPostSortedByDate().slice(0, k);
};

export const getStaticPaths = () => {
  return posts.map(convertToUTC8).map(covertToStaticPaths);
};

export const getPostsForRSS = () => {
  return getPostSortedByDate().map(convertToUTC8);
};

/**
 * Group by categories, which is a string with comma separated
 * Notice that the category is flattened, so each post may appear multiple times
 * @returns
 */
export const getPostsGroupByCategory = () => {
  const flattenCategoryPosts = getPostSortedByDate().flatMap((post) => {
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

export const getCategoryStaticPaths = () => {
  const categories = getPostsGroupByCategory();
  return Object.keys(categories).map((category) => ({
    params: { category },
    props: { posts: categories[category].map(convertToUTC8), category },
  }));
};
