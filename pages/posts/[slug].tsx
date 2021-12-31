import { serialize } from "next-mdx-remote/serialize";
import { getAllPosts, getPostBySlug } from "../../lib/api";
import { Typography } from "@mui/material";
import { GetStaticPaths, GetStaticProps } from "next";
import type { Props } from "../../types/BlogPost";
import PostBody from "../../components/postBody";

export default function Post({
  source,
  frontMatter,
  path,
  mapImageNameToSize,
}: Props) {
  return (
    <div>
      <Typography component="div" variant="h4">
        {frontMatter.title}
      </Typography>
      <PostBody
        source={source}
        path={path}
        mapImageNameToSize={mapImageNameToSize}
      />
    </div>
  );
}

export const getStaticProps: GetStaticProps<Props> = async ({
  params,
}: any) => {
  const post = getPostBySlug(params.slug);

  // TODO: add plugin (code block, ...)
  const mdxSource = await serialize(post.content, { scope: post.data });

  return {
    props: {
      source: mdxSource,
      frontMatter: post.data,
      path: post.path,
      mapImageNameToSize: post.mapImageNameToSize,
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
