import Image from "next/image";
import { ReactNode } from "react";
import { processor } from "../lib/markdownProcessor";
import type { BlogPostProps, ImageNameDimensions } from "../types/BlogPost";
import "katex/dist/katex.min.css";
import "highlight.js/styles/stackoverflow-light.css";
import styled from "@emotion/styled";
import { Divider, Typography } from "@mui/material";

const ImageBox = styled.div`
  display: flex;
  justify-content: center;
`;

const StyledImage = styled(Image)`
  border-radius: 10px;
`;

const Img = (mapImageNameToDimensions: ImageNameDimensions, path: string) => {
  return function MyImg({ src: filename, alt }: { src: string; alt: string }) {
    filename = filename.slice(2);
    const { height, width } = mapImageNameToDimensions[filename];
    return (
      <ImageBox>
        <StyledImage
          alt={alt}
          src={`${path}${filename}`}
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
  h2: (props: any) => <Typography variant="h4" sx={{ mt: 4 }} {...props} />,
  h3: (props: any) => <Typography variant="h5" sx={{ mt: 3 }} {...props} />,
  p: (props: any) => <Typography variant="body1" sx={{ my: 1.5 }} {...props} />,
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
  hr: (props: any) => <Divider {...props} />,
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
