import { unified } from "unified";
import { visit } from "unist-util-visit";
import markdown from "remark-parse";
import stringifyMarkdown from "remark-stringify";
import remarkFrontmatter from "remark-frontmatter";
import { promisify } from "util";
import path from "path";
import fs from "fs";
import matter from "gray-matter";

// TODO should move to GitHub Action for updating, it is a time-consuming task.

import pkg from "glob";
const { glob } = pkg;

import prisma from "./prisma.mjs";
import { cloneTargetDir } from "./constant.mjs";

const STATIC_ASSET_FOLDER = "posts";

export async function parseMarkdownPost() {
  const fileList = await promisify(glob)(`${cloneTargetDir}/**/*.md`);

  const upsertTasks = [];

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

    const task = prisma.post.upsert({
      where: {
        filename: baseName,
      },
      update: {
        title: data.title,
        date: data.date,
        category: data.categories,
        description: data.description,
        markdownContent: content,
        comment: data.comments,
      },
      create: {
        title: data.title,
        date: data.date,
        category: data.categories,
        description: data.description,
        markdownContent: content,
        comment: data.comments,
        filename: baseName,
      },
    });

    upsertTasks.push(task);

    console.log("Done parsing post", path.basename(filePath));
  }

  console.log("Start transaction");
  await prisma.$transaction(upsertTasks);
  console.log("End transaction");
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
