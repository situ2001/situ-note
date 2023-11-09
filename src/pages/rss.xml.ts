import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import sanitizeHtml from "sanitize-html";
import MarkdownIt from "markdown-it";

const parser = new MarkdownIt();

export async function GET(context: any) {
  const posts = (await getCollection("blog"))
    .map((post) => ({
      ...post,
      data: {
        ...post.data,
        date: new Date(post.data.date.getTime() + -480 * 60000),
      },
    }))
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
  return rss({
    title: "Situ Note",
    description: "Personal website of situ2001",
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: `/blog/${post.slug}/`,
      categories: post.data.categories.split(","),
      content: sanitizeHtml(
        parser.render(
          "> 该内容使用MarkdownIt渲染，如需查看图片及获取更好的排版，请阅读原文\n\n" +
            post.body
        )
      ),
    })),
  });
}
