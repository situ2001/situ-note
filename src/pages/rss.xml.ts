import rss from "@astrojs/rss";
import sanitizeHtml from "sanitize-html";
import MarkdownIt from "markdown-it";
import {
  convertStringCategoriesToArray,
  getPostsForRSS,
  posts as postsData,
} from "../api/blog";
import { BLOG_DESCRIPTION, BLOG_TITLE } from "../config";

const parser = new MarkdownIt();

export async function GET(context: any) {
  const posts = getPostsForRSS(postsData);

  return rss({
    title: BLOG_TITLE,
    description: BLOG_DESCRIPTION,
    site: context.site,
    customData: `<follow_challenge><feedId>69199567573101568</feedId><userId>41663616878351360</userId></follow_challenge>`,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: `/blog/${post.slug}/`,
      categories: convertStringCategoriesToArray(post.data.categories),
      content: sanitizeHtml(
        parser.render(
          "> 该内容使用MarkdownIt渲染，如需查看图片及获取更好的排版，请阅读原文\n" +
          "> This content is rendered using MarkdownIt, for better layout and images, please read the original post\n\n" +
            post.body
        )
      ),
    })),
  });
}
