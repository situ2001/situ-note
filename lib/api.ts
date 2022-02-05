import fs from "fs";
import path, { join, basename, relative, dirname } from "path";
import matter from "gray-matter";
import glob from "glob";
import safeJsonStringify from "safe-json-stringify";
import fse from "fs-extra";
import sizeOf from "image-size";
import type { ImageNameDimensions } from "../types/BlogPost";

const postDir = join(process.cwd(), "contents", "blog-posts", "_posts");
const publicDir = join(process.cwd(), "public", "post-assets");

export function getAllMarkdownFileNames() {
  const res = glob.sync(`${postDir}/**/*.md`);
  return res.map((f) =>
    dirname(relative(postDir, f)).split(path.sep).join(path.posix.sep)
  );
}

export function getAllPostsStaticPath() {
  const slugs = getAllMarkdownFileNames();
  const res = slugs.map((slug) => slug.replace(/\.md$/, ""));
  return res;
}

export function getPostList() {
  // const numberOfPosts = getNumberOfPosts();
  const paths = glob.sync(`${postDir}/**/*.md`);
  const infos: any[] = [];
  paths.forEach((pathOfPost) => {
    const fileContent = fs.readFileSync(pathOfPost, "utf-8");
    const { data } = matter(fileContent);
    let { title, date, categories, description } = data;

    if (description === undefined) description = "";
    if (categories === undefined) categories = "";

    infos.push({
      title,
      date: safeJsonStringify(date).replace(/"/g, ""),
      categories,
      description,
      link: `/posts/${dirname(relative(postDir, pathOfPost))
        .split(path.sep)
        .join(path.posix.sep)}`,
    });
  });
  infos.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return infos;
}

export function getPostBySlug(slug: string[], fields = []) {
  const fullPath = glob.sync(`${postDir}/**/${slug.join("/")}/*.md`)[0];
  const fileContent = fs.readFileSync(fullPath, "utf-8");
  const { data, content } = matter(fileContent);

  const targetPath =
    "/" + relative(process.cwd(), dirname(fullPath)).replace(/\\/g, "/") + "/";

  // key: ./img.ext
  // value: height & width
  const mapImageNameToSize: ImageNameDimensions = {};

  // get absolute path of images
  const imgsAbsolutePath = fs
    .readdirSync(dirname(fullPath))
    .filter((f) => /\.(jpe?g|png|gif)$/gi.test(f))
    .map((f) => join(dirname(fullPath), f));

  // add name => height & weight to object
  imgsAbsolutePath.forEach((img) => {
    const name = basename(img);
    const dimensions = sizeOf(img);
    const { height, width } = dimensions;
    mapImageNameToSize[name] = { height, width };
  });

  // copy dir to /public if not existed
  try {
    // TODO: copy only images
    fse.copySync(dirname(fullPath), join(`${publicDir}`, targetPath));
  } catch (e) {
    // console.error(e);
  }

  const items = {
    content: content,
    slug: slug,
    path: `/post-assets${targetPath}`,
    data: JSON.parse(safeJsonStringify(data)),
    mapImageNameToSize: mapImageNameToSize,
  };

  return items;
}
