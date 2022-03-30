import { Container, Divider } from "@mui/material";
import { GetStaticPaths, GetStaticProps } from "next";
import type { Props } from "../../types/BlogPost";
import PostBody from "../../components/PostBody";
import Layout from "../../components/Layout";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import PostHeader from "../../components/PostHeader";

export default function Post({ frontMatter, content }: Props) {
  useDocumentTitle(frontMatter.title);

  return (
    <Layout>
      <Container maxWidth="md">
        <PostHeader frontMatter={frontMatter} />
        <Divider sx={{ mb: 2 }}></Divider>
        <PostBody content={content} />
      </Container>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps<Props> = async ({
  params,
}: any) => {
  const post = await (
    await fetch(`https://${process.env.API_URL}/posts/${params.slug}`)
  ).json();

  // console.log(post);
  // console.log(params);

  return {
    props: {
      content: post.content,
      frontMatter: post.frontMatter,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs: string[] = await (
    await fetch(`https://${process.env.API_URL}/posts/list/names`)
  ).json();

  return {
    paths: slugs.map((slug: string) => ({
      params: {
        slug,
      },
    })),
    fallback: false,
  };
};
