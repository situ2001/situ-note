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
      <div className="flex justify-center">
        <div className="w-full max-w-2xl">
          <PostHeader frontMatter={frontMatter} />
          <div className="divider">正文开始</div>
          <PostBody content={content} />
          <div className="divider">正文结束</div>
        </div>
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps<Props> = async ({
  params,
}: any) => {
  const post = await (
    await fetch(`https://${process.env.API_URL}/posts/${params.slug}`)
  ).json();

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
