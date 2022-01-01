import { getAllPosts, getPostBySlug } from "../../lib/api";
import { Typography } from "@mui/material";
import { GetStaticPaths, GetStaticProps } from "next";
import remarkMath from "remark-math";
import type { Props } from "../../types/BlogPost";
import PostBody from "../../components/postBody";

export default function Post({
  frontMatter,
  path,
  mapImageNameToDimensions,
  content,
}: Props) {
  return (
    <div>
      <Typography component="div" variant="h3">
        {frontMatter.title}
      </Typography>
      <PostBody
        path={path}
        content={content}
        mapImageNameToDimensions={mapImageNameToDimensions}
      />
    </div>
  );
}

export const getStaticProps: GetStaticProps<Props> = async ({
  params,
}: any) => {
  const post = getPostBySlug(params.slug);

  return {
    props: {
      content: post.content,
      frontMatter: post.data,
      path: post.path,
      mapImageNameToDimensions: post.mapImageNameToSize,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = getAllPosts();

  return {
    paths: slugs.map((slug) => ({
      params: {
        slug: slug,
      },
    })),
    fallback: false,
  };
};
