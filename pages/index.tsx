import { Post } from "@prisma/client";
import type { GetStaticProps, NextPage } from "next";
import { parse } from "node-html-parser";
import prisma from "../lib/prisma";
import Layout from "../components/Layout";
import PersonalCard from "../components/PersonalCard";
import RecentPosts from "../components/RecentPosts";
import useDocumentTitle from "../hooks/useDocumentTitle";

interface Props {
  recentPost: Post[];
}

const Home: NextPage<Props> = (props: Props) => {
  useDocumentTitle("Home");

  const { recentPost } = props;

  return (
    <Layout hideHeader>
      <PersonalCard />
      <RecentPosts recentPost={recentPost} />
    </Layout>
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const recentPost = await prisma.post.findMany({
    take: 5,
    orderBy: {
      date: "desc",
    },
  });

  return {
    props: {
      recentPost: JSON.parse(JSON.stringify(recentPost)),
    },
  };
};

export default Home;
