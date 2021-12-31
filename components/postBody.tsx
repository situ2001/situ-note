import { MDXRemote } from "next-mdx-remote";
import Image from "next/image";
import { ReactNode } from "react";
import type { BlogPostProps, ImageNameDimensions } from "../types/BlogPost";

const Img = (mapImageNameToDimensions: ImageNameDimensions, path: string) => {
  return function MyImg({ src, alt }: { src: string; alt: string }) {
    src = src.slice(2);
    const { height, width } = mapImageNameToDimensions[src];
    // TODO: https://kylepfromer.com/blog/nextjs-image-component-blog
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          margin: "8px 25vw",
          position: "relative",
        }}
      >
        <Image
          alt={alt}
          src={`${path}${src}`}
          height={height}
          width={width}
          objectFit="contain"
          loading="lazy"
        />
      </div>
    );
  };
};

const components: Record<string, ReactNode> = {
  img: undefined,
};

export default function PostBody({
  source,
  path,
  mapImageNameToDimensions,
}: BlogPostProps) {
  components.img = Img(mapImageNameToDimensions, path);

  return <MDXRemote {...source} components={components} lazy />;
}
