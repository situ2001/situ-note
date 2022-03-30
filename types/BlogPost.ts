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
  content: string;
  frontMatter: FrontMatter;
};

export type BlogPostProps = {
  content: string;
};
