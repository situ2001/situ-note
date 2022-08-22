import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import prisma from "../../lib/prisma";
import Layout from "../../components/Layout";
import Loading from "../../components/Loading";
import Pagination from "../../components/Pagination";
import PostInfoCard from "../../components/PostInfoCard";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import { Post } from "@prisma/client";

export default function PostIndex(props: {
  postDetails: Post[];
  totalPage: number;
}) {
  const { postDetails, totalPage } = props;

  const { isFallback } = useRouter();

  useDocumentTitle("文章列表");

  if (isFallback) {
    // TODO skeleton
    return <Loading />;
  } else {
    return (
      <Layout>
        <div className="flex justify-center w-full">
          <div className="flex flex-col justify-center items-center w-full max-w-2xl">
            {postDetails.map((info, i) => {
              const { title, date, description, category, filename } = info;
              return (
                <PostInfoCard
                  key={i}
                  title={title}
                  date={date.toString()}
                  description={description}
                  categories={category}
                  link={`/posts/${filename}`}
                ></PostInfoCard>
              );
            })}
            <div className="w-full">
              <Pagination totalPage={totalPage} />
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

const NUMBER_PER_PAGE = 10;

export const getStaticProps: GetStaticProps<any> = async ({ params }) => {
  // sql jump
  let data = await prisma.post.findMany({
    orderBy: { date: "desc" },
    skip: (Number(params!.index) - 1) * NUMBER_PER_PAGE,
    take: NUMBER_PER_PAGE,
    select: {
      title: true,
      category: true,
      description: true,
      date: true,
      filename: true,
    },
  });

  const len = await prisma.post.count({});

  if (data === null) {
    return {
      notFound: true,
    };
  }

  data = data.map((d) => ({ ...d, date: JSON.parse(JSON.stringify(d.date)) }));

  return {
    props: {
      postDetails: data,
      totalPage: Math.ceil(len / NUMBER_PER_PAGE),
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const len = await prisma.post.count({});

  const paths = Array(Math.ceil(len / NUMBER_PER_PAGE))
    .fill(undefined)
    .map((_, i) => String(i + 1));

  return {
    paths: paths.map((index: string) => ({
      params: {
        index,
      },
    })),
    fallback: true,
  };
};
