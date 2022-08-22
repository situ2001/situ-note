import { GetStaticPaths, GetStaticProps } from "next";
import prisma from "../../lib/prisma";
import type { Props } from "../../types/BlogPost";
import Layout from "../../components/Layout";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import PostHeader from "../../components/PostHeader";
import { useRouter } from "next/router";
import Loading from "../../components/Loading";
import dynamic from "next/dynamic";

export default function Post({ data }: Props) {
  const { isFallback } = useRouter();

  useDocumentTitle(data?.title ?? "Loading...");

  if (isFallback) {
    return <Loading />;
  }

  const PostBody = dynamic(() => import("../../components/PostBody"), {
    loading: () => <Loading />,
  });

  return (
    <Layout>
      <div className="flex justify-center">
        <div className="w-full max-w-3xl">
          <PostHeader frontMatter={data} />
          <PostBody content={data} />
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
