import rss from "@astrojs/rss";
import sanitizeHtml from "sanitize-html";
import MarkdownIt from "markdown-it";
import {
  convertStringCategoriesToArray,
  getPostsForRSS,
  posts as postsData,
} from "../api/blog";

const parser = new MarkdownIt();

export async function GET(context: any) {
  const posts = getPostsForRSS(postsData);
  return rss({
    title: "Situ Note",
    description: "Personal website of situ2001",
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: `/blog/${post.slug}/`,
      categories: convertStringCategoriesToArray(post.data.categories),
      content: sanitizeHtml(
        parser.render(
          "> 该内容使用MarkdownIt渲染，如需查看图片及获取更好的排版，请阅读原文\n\n" +
            post.body
        )
      ),
    })),
  });
}
