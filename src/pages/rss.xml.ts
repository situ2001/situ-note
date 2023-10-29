import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

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
    })),
  });
}
