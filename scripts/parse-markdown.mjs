import { unified } from "unified";
import { visit } from "unist-util-visit";
import markdown from "remark-parse";
import stringifyMarkdown from "remark-stringify";
import remarkFrontmatter from "remark-frontmatter";
import { promisify } from "util";
import path from "path";
import fs from "fs";
import matter from "gray-matter";

import pkg from "glob";
const { glob } = pkg;

import prisma from "./prisma.mjs";
import { cloneTargetDir } from "./constant.mjs";

const STATIC_ASSET_FOLDER = "posts";

export async function parseMarkdownPost() {
  const fileList = await promisify(glob)(`${cloneTargetDir}/**/*.md`);

  for (const postFile of fileList) {
    const filePath = postFile;

    // parse content
    const markdownProcessor = unified()
      .use(markdown)
      .use(remarkFrontmatter)
      // use custom function to replace image url
      .use(replaceImageUrl, { filePath })
      .use(stringifyMarkdown);

    const result = await markdownProcessor.process(fs.readFileSync(filePath));

    // parse front matter
    const { content, data } = matter(result.toString("utf-8"));
    // console.log(data);
    const baseName = path.basename(filePath, ".md");
    const existed = await prisma.post.count({
      where: {
        filename: baseName,
      },
    });
    if (existed > 0) {
      const post = await prisma.post.update({
        where: {
          filename: baseName,
        },
        data: {
          title: data.title,
          date: data.date,
          category: data.categories,
          description: data.description,
          markdownContent: content,
          comment: data.comments,
        },
      });
      console.log("updated", baseName);
    } else {
      const post = await prisma.post.create({
        data: {
          title: data.title,
          date: data.date,
          category: data.categories,
          description: data.description,
          markdownContent: content,
          comment: data.comments,
          filename: baseName,
        },
      });
      console.log("created", baseName);
      // console.log(post);
    }

    console.log("Done parsing post", path.basename(filePath));
  }
}

function replaceImageUrl({ filePath }) {
  const dirPath = path.dirname(filePath);
  const slug = path.basename(filePath, ".md");
  const staticRootFolderPath = path.join(
    process.cwd(),
    "public",
    STATIC_ASSET_FOLDER
  );
  const targetFolderPath = path.join(
    process.cwd(),
    "public",
    STATIC_ASSET_FOLDER,
    slug
  );

  if (!fs.existsSync(staticRootFolderPath)) {
    fs.mkdirSync(staticRootFolderPath);
  }

  const transformer = (tree) => {
    // console.log(filePath);
    // console.log(tree);
    visit(tree, "image", (node) => {
      // console.log(node);
      if (!fs.existsSync(targetFolderPath)) {
        fs.mkdirSync(targetFolderPath);
      }

      const srcPath = path.join(dirPath, node.url);

      const imgFileName = path.basename(node.url);
      const dstPath = path.join(targetFolderPath, imgFileName);

      // copy
      if (fs.existsSync(srcPath) && !fs.existsSync(dstPath)) {
        fs.copyFileSync(srcPath, dstPath);
      }

      // modify url of node
      node.url = `/${STATIC_ASSET_FOLDER}/${slug}/${imgFileName}`;
      // console.log(node);
    });
  };

  return transformer;
}
