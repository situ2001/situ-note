import { getCollection, type CollectionEntry } from "astro:content";

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
