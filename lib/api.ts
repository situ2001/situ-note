import fs from "fs";
import { join, basename, relative, dirname } from "path";
import matter from "gray-matter";
import glob from "glob";
import safeJsonStringify from "safe-json-stringify";
import fse from "fs-extra";

const postDir = join(process.cwd(), "contents", "blog-posts", "_posts");
const publicDir = join(process.cwd(), "public", "post-assets");

export function getAllMarkdownFileNames() {
  const res = glob.sync(`${postDir}/**/*.md`);
  res.map((f) => basename(f));
  return res;
}

export function getAllPosts() {
  const slugs = getAllMarkdownFileNames();
  const res = slugs.map((slug) => basename(slug).replace(/\.md$/, ""));
  return res;
}

export function getPostBySlug(slug: string, fields = []) {
  const fullPath = glob.sync(`${postDir}/**/${slug}.md`)[0];
  const fileContent = fs.readFileSync(fullPath, "utf-8");
  const { data, content } = matter(fileContent);

  const targetPath =
    "/" + relative(process.cwd(), dirname(fullPath)).replace(/\\/g, "/") + "/";

  // copy dir to /public if not existed
  try {
    // TODO: copy only images
    fse.copySync(dirname(fullPath), join(`${publicDir}`, targetPath));
  } catch (e) {
    console.error(e);
  }

  const items = {
    content: content,
    slug: slug,
    path: `/post-assets${targetPath}`,
    data: JSON.parse(safeJsonStringify(data)),
  };

  return items;
}
