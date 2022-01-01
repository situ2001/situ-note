import Image from "next/image";
import { ReactNode } from "react";
import { processor } from "../lib/markdownProcessor";
import type { BlogPostProps, ImageNameDimensions } from "../types/BlogPost";

const Img = (mapImageNameToDimensions: ImageNameDimensions, path: string) => {
  return function MyImg({ src, alt }: { src: string; alt: string }) {
    src = src.slice(2);
    const { height, width } = mapImageNameToDimensions[src];
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
  // h2: (props: any) => <h2 {...props} className="text-3xl" />,
  p: (props: any) => <p className="my-4" {...props} />,
  img: undefined,
};

export default function PostBody({
  path,
  mapImageNameToDimensions,
  content,
}: BlogPostProps) {
  components.img = Img(mapImageNameToDimensions, path);

  const contentProcessor = processor(components);

  return <article>{contentProcessor.processSync(content).result}</article>;
}
