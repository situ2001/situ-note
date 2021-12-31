import type { MDXRemoteSerializeResult } from "next-mdx-remote";

export type ImageNameDimensions = {
  [key: string]: {
    height: number | undefined;
    width: number | undefined;
  };
};

export type FrontMatter = {
  title: string;
  comment: boolean;
  date: string;
  categories: string;
};

export type Props = {
  source: MDXRemoteSerializeResult<Record<string, unknown>>;
  frontMatter: FrontMatter;
  path: string;
  mapImageNameToDimensions: ImageNameDimensions;
};

export type BlogPostProps = {
  source: MDXRemoteSerializeResult<Record<string, unknown>>;
  path: string;
  mapImageNameToDimensions: ImageNameDimensions;
};
