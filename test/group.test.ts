import { expect, test } from "vitest";
import { createBlogCatalog, type Post } from "../src/features/blog/catalog";

const posts = [
  { id: "new", data: { date: new Date("2025-01-01T01:00:00Z"), categories: "a, b" } },
  { id: "old", data: { date: new Date("2024-12-31T10:00:00Z"), categories: "a" } },
] as Post[];

test("blog views keep ordering, categories, routes, and publication dates aligned", () => {
  const blog = createBlogCatalog(posts);

  expect(blog.recent(1).map((post) => post.id)).toEqual(["new"]);
  expect(blog.archiveByYear().map(({ year, posts }) => [year, posts.map((post) => post.id)])).toEqual([
    [2025, ["new"]],
    [2024, ["old"]],
  ]);
  expect(blog.categoryNames()).toEqual(["a", "b"]);
  expect(blog.categoryPaths().map(({ params }) => params.category)).toEqual(["a", "b"]);
  expect(blog.categoryPaths()[0].props.posts.map((post) => post.id)).toEqual(["new", "old"]);
  expect(blog.postPaths().map(({ params }) => params.slug)).toEqual(["new", "old"]);
  expect(blog.postPaths()[0].props.data.date.toISOString()).toBe("2025-01-01T01:00:00.000Z");
  expect(blog.feedPosts().map((post) => post.id)).toEqual(["new", "old"]);
  expect(blog.feedPosts()[0].data.date.toISOString()).toBe(
    blog.postPaths()[0].props.data.date.toISOString(),
  );
  expect(posts[0].data.date.toISOString()).toBe("2025-01-01T01:00:00.000Z");
});

test("archive groups a UTC December 31 publication under January 1 in UTC+8", () => {
  const previousTimezone = process.env.TZ;
  try {
    process.env.TZ = "America/New_York";
    const blog = createBlogCatalog([
      { id: "new-year", data: { date: new Date("2024-12-31T17:00:00Z"), categories: "a" } },
    ] as Post[]);

    expect(blog.archiveByYear().map(({ year }) => year)).toEqual([2025]);
  } finally {
    if (previousTimezone === undefined) delete process.env.TZ;
    else process.env.TZ = previousTimezone;
  }
});
