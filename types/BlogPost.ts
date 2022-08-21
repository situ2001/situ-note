import { Post } from "@prisma/client";

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
  data: Post;
};

export type BlogPostProps = {
  content: Post;
};
