import type { CollectionEntry } from "astro:content";
import type { GetStaticPaths, APIRoute } from "astro";
import { blog } from "@/features/blog/blog";
import { postCoverImage } from "@/features/blog/coverImage";
import config from "config";

export const getStaticPaths = blog.postPaths satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props, site }) => {
  const post = props as CollectionEntry<"blog">;
  const image = await postCoverImage(post);
  const data = {
    version: "1.0",
    type: "link",
    title: post.data.title,
    author_name: config.author,
    author_url: site!.href,
    provider_name: config.title,
    provider_url: site!.href,
    ...(image?.width && image.height && {
      thumbnail_url: new URL(image.src, site).href,
      thumbnail_width: image.width,
      thumbnail_height: image.height,
    }),
  };
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
};
