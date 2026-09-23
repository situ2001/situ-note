import { expect, test } from "vitest";
import { groupByLocalYear } from "../src/features/blog/BlogArchive";

test("archive groups posts by the reader's calendar year", () => {
  const previousTimezone = process.env.TZ;
  try {
    process.env.TZ = "America/New_York";
    expect(groupByLocalYear([
      { id: "new", title: "New", date: "2025-01-01T01:00:00Z" },
      { id: "old", title: "Old", date: "2024-12-31T10:00:00Z" },
    ])).toEqual([
      { year: 2024, posts: [
        { id: "new", title: "New", date: "2025-01-01T01:00:00Z" },
        { id: "old", title: "Old", date: "2024-12-31T10:00:00Z" },
      ] },
    ]);
  } finally {
    if (previousTimezone === undefined) delete process.env.TZ;
    else process.env.TZ = previousTimezone;
  }
});
