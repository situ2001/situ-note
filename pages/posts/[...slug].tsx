import { getAllPostsStaticPath, getPostBySlug } from "../../lib/api";
import { Container, Typography } from "@mui/material";
import { GetStaticPaths, GetStaticProps } from "next";
import type { Props } from "../../types/BlogPost";
import PostBody from "../../components/postBody";
import SiteBar from "../../components/SiteBar";
import Layout from "../../components/Layout";
import useDocumentTitle from "../../hooks/useDocumentTitle";

export default function Post({
  frontMatter,
  path,
  mapImageNameToDimensions,
  content,
}: Props) {
  useDocumentTitle(frontMatter.title);

  return (
    <Layout>
      <Container>
        <Typography component="div" variant="h4">
          {frontMatter.title}
        </Typography>
        <PostBody
          path={path}
          content={content}
          mapImageNameToDimensions={mapImageNameToDimensions}
        />
      </Container>
    </Layout>
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
  const slugs = getAllPostsStaticPath();

  return {
    paths: slugs.map((slug) => ({
      params: {
        slug: slug.split("/"),
      },
    })),
    fallback: false,
  };
};
