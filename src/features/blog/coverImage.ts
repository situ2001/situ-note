import { posix } from "node:path";
import { getImage } from "astro:assets";
import type { ImageMetadata } from "astro";
import type { CollectionEntry } from "astro:content";

export interface CoverImage {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  type?: string;
}

const images = import.meta.glob<{ default: ImageMetadata }>(
  "/src/content/blog/**/*.{avif,gif,jpeg,jpg,png,webp}",
);

export async function postCoverImage(post: CollectionEntry<"blog">) {
  if (!post.data.heroImage) return undefined;
  return coverImage(post.filePath!, { src: post.data.heroImage, alt: post.data.title });
}

export async function coverImage(
  filePath: string,
  image: Pick<CoverImage, "src" | "alt">,
): Promise<CoverImage> {
  // Public files and external images already have browser-accessible URLs.
  if (/^(https?:)?\//.test(image.src)) return image;

  const path = posix.resolve("/", posix.dirname(filePath), decodeURI(image.src));
  const { default: source } = await images[path]();
  // A separate sharing image keeps the full source inside a common card size.
  const optimized = await getImage({
    src: source,
    width: 1200,
    height: 630,
    format: "jpeg",
    sharing: true,
  });
  return {
    src: optimized.src,
    alt: image.alt,
    width: optimized.attributes.width,
    height: optimized.attributes.height,
    type: "image/jpeg",
  };
}
