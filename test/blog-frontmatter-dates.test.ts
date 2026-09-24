import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { parseFrontmatter } from "@astrojs/markdown-remark";
import { expect, test } from "vitest";

function postFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return entry.name === "_templates" ? [] : postFiles(path);
    return /\.mdx?$/.test(entry.name) ? [path] : [];
  });
}

test("blog frontmatter declares the publication timezone explicitly", () => {
  const files = postFiles("src/content/blog");
  expect(files.length).toBeGreaterThan(0);
  for (const file of files) {
    const date = parseFrontmatter(readFileSync(file, "utf8")).frontmatter.date;
    expect(date, file).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:Z|[+-]\d{2}:\d{2})$/);
  }
});
