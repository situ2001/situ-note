import type { CollectionEntry } from "astro:content";
import { groupBy } from "es-toolkit";

export type Post = CollectionEntry<"blog">;

export function createBlogCatalog(posts: Post[]) {
  const sortedPosts = () =>
    posts.slice().sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  // Preserve the published date conversion used by post routes, category routes,
  // and the feed. Archive and recent lists continue to use collection dates.
  const publishedPost = (post: Post): Post => ({
    ...post,
    data: {
      ...post.data,
      date: new Date(post.data.date.getTime() - 480 * 60000),
    },
  });

  const categoriesFor = (categories: string) =>
    categories.split(",").map((category) => category.trim());

  const groupedCategories = () =>
    groupBy(
      sortedPosts().flatMap((post) =>
        categoriesFor(post.data.categories).map((category) => ({
          ...post,
          data: { ...post.data, categories: category },
        })),
      ),
      (post) => post.data.categories,
    );

  return {
    categoriesFor,

    recent(count: number): Post[] {
      return sortedPosts().slice(0, count);
    },

    archiveByYear(): { year: number; posts: Post[] }[] {
      const years = groupBy(sortedPosts(), (post) => post.data.date.getUTCFullYear());
      return Object.keys(years)
        .map(Number)
        .sort((a, b) => b - a)
        .map((year) => ({ year, posts: years[year] }));
    },

    categoryNames(): string[] {
      return Object.keys(groupedCategories());
    },

    postPaths() {
      return posts.map((post) => ({
        params: { slug: post.slug },
        props: publishedPost(post),
      }));
    },

    categoryPaths() {
      const categories = groupedCategories();
      return Object.keys(categories).map((category) => ({
        params: { category },
        props: { posts: categories[category].map(publishedPost), category },
      }));
    },

    feedPosts(): Post[] {
      return sortedPosts().map(publishedPost);
    },
  };
}
