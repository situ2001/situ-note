import { assert, expect, test } from "vitest";

import { getPostsGroupByCategory, type Post } from "../src/api/blog";

test("groupBy", () => {
  const mockPost = [
    {
      data: {
        date: new Date(),
        categories: "a, b, c, test spacing",
      },
    },
    {
      data: {
        date: new Date(),
        categories: "a",
      },
    },
  ];

  const grouped = getPostsGroupByCategory(mockPost as Post[]);

  expect(Object.keys(grouped).length).toBe(4);
  expect(Object.keys(grouped)).toEqual(["a", "b", "c", "test spacing"]);
  expect(grouped["a"].length).toBe(2);
});
