import { GetStaticPaths, GetStaticProps } from "next";
import type { Props } from "../../types/BlogPost";
import PostBody from "../../components/PostBody";
import Layout from "../../components/Layout";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import PostHeader from "../../components/PostHeader";
import { useRouter } from "next/router";
import Loading from "../../components/Loading";

export default function Post({ frontMatter, content }: Props) {
  const { isFallback } = useRouter();

  useDocumentTitle(frontMatter?.title ?? "Loading...");

  if (isFallback) {
    return <Loading />;
  }

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
  const postRequest = await fetch(
    `https://${process.env.API_URL}/posts/${params.slug}`
  );

  if (!postRequest.ok) {
    return {
      notFound: true,
    };
  }

  const post = await postRequest.json();

  return {
    props: {
      content: post.content,
      frontMatter: post.frontMatter,
    },
    revalidate: 5,
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
    fallback: true,
  };
};
