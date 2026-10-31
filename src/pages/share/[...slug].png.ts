import type { APIRoute } from "astro";
import type { CollectionEntry } from "astro:content";
import { blog } from "@/features/blog/blog";
import { renderSharingCover } from "@/features/blog/sharingCover";

export const getStaticPaths = () => blog.postPaths().filter(({ props }) => !props.data.heroImage);

export const GET: APIRoute = async ({ props }) => {
  const post = props as CollectionEntry<"blog">;
  const image = await renderSharingCover({
    title: post.data.title,
    description: post.data.description,
  });
  return new Response(new Uint8Array(image), {
    headers: { "Content-Type": "image/png" },
  });
};
