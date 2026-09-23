import { expect, test } from "vitest";
import { parsePublicationDate } from "../src/features/blog/publicationDate";

test("interprets an unqualified publication time in the blogger's UTC+8 timezone", () => {
  expect(parsePublicationDate("2025-01-01 01:00:00").toISOString()).toBe(
    "2024-12-31T17:00:00.000Z",
  );
  expect(parsePublicationDate("2025-01-01").toISOString()).toBe("2024-12-31T16:00:00.000Z");
  expect(parsePublicationDate(new Date("2025-01-01T01:00:00Z")).toISOString()).toBe(
    "2024-12-31T17:00:00.000Z",
  );
});

test("preserves publication times that already specify a timezone", () => {
  expect(parsePublicationDate("2025-01-01T01:00:00Z").toISOString()).toBe(
    "2025-01-01T01:00:00.000Z",
  );
});
