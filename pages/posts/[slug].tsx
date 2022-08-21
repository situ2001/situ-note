import { GetStaticPaths, GetStaticProps } from "next";
import prisma from "../../lib/prisma";
import type { Props } from "../../types/BlogPost";
import PostBody from "../../components/PostBody";
import Layout from "../../components/Layout";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import PostHeader from "../../components/PostHeader";
import { useRouter } from "next/router";
import Loading from "../../components/Loading";

export default function Post({ data }: Props) {
  const { isFallback } = useRouter();

  useDocumentTitle(data?.title ?? "Loading...");

  if (isFallback) {
    return <Loading />;
  }

  return (
    <Layout>
      <div className="flex justify-center">
        <div className="w-full max-w-2xl">
          <PostHeader frontMatter={data} />
          <div className="divider">正文开始</div>
          <PostBody content={data} />
          <div className="divider">正文结束</div>
        </div>
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps<Props> = async ({
  params,
}: any) => {
  const data = await prisma.post.findFirst({
    where: { filename: params.slug },
  });

  if (data === null) {
    return {
      notFound: true,
    };
  }

  data.date = JSON.parse(JSON.stringify(data.date));

  return {
    props: {
      data: data,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = (await prisma.post.findMany({})).map((post) => post.filename);

  return {
    paths: slugs.map((slug: string) => ({
      params: {
        slug,
      },
    })),
    fallback: true,
  };
};
