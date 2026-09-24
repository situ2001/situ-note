import { expect, test } from "vitest";
import { parsePublicationDate } from "../src/features/blog/publicationDate";

test("requires an explicit timezone for publication times", () => {
  expect(() => parsePublicationDate("2025-01-01 01:00:00")).toThrow("Invalid publication date");
  expect(() => parsePublicationDate("2025-01-01")).toThrow("Invalid publication date");
});

test("preserves publication times that already specify a timezone", () => {
  expect(parsePublicationDate("2025-01-01T01:00:00+08:00").toISOString()).toBe(
    "2024-12-31T17:00:00.000Z",
  );
  expect(parsePublicationDate("2025-01-01T01:00:00Z").toISOString()).toBe(
    "2025-01-01T01:00:00.000Z",
  );
});
