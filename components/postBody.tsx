import Image from "next/image";
import { ReactNode } from "react";
import { processor } from "../lib/markdownProcessor";
import type { BlogPostProps, ImageNameDimensions } from "../types/BlogPost";
import "katex/dist/katex.min.css";
import "highlight.js/styles/stackoverflow-light.css";
import styled from "@emotion/styled";

const ImageBox = styled.div`
  display: flex;
  justify-content: center;
  position: relative;
  @media (min-width: 600px) {
    margin: 8px 20%;
  }
`;

const Img = (mapImageNameToDimensions: ImageNameDimensions, path: string) => {
  return function MyImg({ src, alt }: { src: string; alt: string }) {
    src = src.slice(2);
    const { height, width } = mapImageNameToDimensions[src];
    return (
      <ImageBox>
        <Image
          alt={alt}
          src={`${path}${src}`}
          height={height}
          width={width}
          objectFit="contain"
          loading="lazy"
        />
      </ImageBox>
    );
  };
};

const components: Record<string, ReactNode> = {
  h2: (props: any) => <h2 className="text-2xl mt-8 font-semibold" {...props} />,
  h3: (props: any) => <h3 className="text-lg mt-6 font-medium" {...props} />,
  p: (props: any) => <p className="my-4" {...props} />,
  a: (props: any) => <a className="break-all underline" {...props} />,
  ol: (props: any) => (
    <ol className="list-decimal list-inside my-4" {...props} />
  ),
  ul: (props: any) => <ul className="list-disc list-inside my-4" {...props} />,
  blockquote: (props: any) => (
    <blockquote
      style={{
        borderLeft: "4px solid #ddd",
        padding: "0 16px",
        margin: 0,
      }}
      {...props}
    />
  ),
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
