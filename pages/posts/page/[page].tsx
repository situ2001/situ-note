import { Box, Card, Container, Typography } from "@mui/material";
import { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import Layout from "../../../components/Layout";
import { getNumberOfPosts, getPostList } from "../../../lib/api";

type PostInfo = {
  title: string;
  date: string;
  description: string;
  categories: string;
  link: string;
};
// TODO: const PostInfoCard
const PostInfoCard = (props: PostInfo) => {
  const { title, date, description, categories, link } = props;

  const dateObject = new Date(date);
  const y = dateObject.getFullYear();
  const m = dateObject.getMonth() + 1;
  const d = dateObject.getDate();

  return (
    <Card className="shadow hover:shadow-lg hover:scale-105 transition-transform delay-50 my-4 mx-2">
      <Box className="m-2">
        <Link href={link} passHref>
          <Typography className="cursor-pointer" variant="h5">
            {title}
          </Typography>
        </Link>
        <Typography>{`${y}年${m}月${d}日`}</Typography>
        <Typography>{description}</Typography>
        <Typography>{categories}</Typography>
      </Box>
    </Card>
  );
};

const PaginationBar = (props: any) => {
  const { totalPage } = props;
  const { query, push } = useRouter();
  const page = Number(query.page);

  const hasPrev = page !== 1;
  const hasNext = page !== totalPage;

  return (
    <Box sx={{ display: "flex" }} className="justify-between mx-2 my-4">
      <Typography
        sx={
          hasPrev
            ? { cursor: "pointer" }
            : { opacity: "0.6", pointerEvents: "none" }
        }
        onClick={() => {
          if (hasPrev) {
            push(`/posts/page/${page - 1}`);
          }
        }}
      >
        {"< Prev"}
      </Typography>
      <Typography>{`${page} / ${totalPage}`}</Typography>
      <Typography
        sx={
          hasNext
            ? { cursor: "pointer" }
            : { opacity: "0.6", pointerEvents: "none" }
        }
        onClick={() => {
          if (hasNext) {
            push(`/posts/page/${page + 1}`);
          }
        }}
      >
        {"Next >"}
      </Typography>
    </Box>
  );
};

type Props = {
  infos: any[];
  totalPage: number;
};

export default function Posts(props: Props) {
  const { infos, totalPage } = props;
  // console.log(props);

  return (
    <Layout>
      <Container>
        <Box>
          {infos.map((info, i) => {
            const { title, date, description, categories, link } = info;
            return (
              <PostInfoCard
                key={i}
                title={title}
                date={date}
                description={description}
                categories={categories}
                link={link}
              ></PostInfoCard>
            );
          })}
        </Box>
        <PaginationBar totalPage={totalPage}></PaginationBar>
      </Container>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps<Props> = async ({
  params,
}: any) => {
  const page = Number(params.page);
  const infos = getPostList(page);

  // prev page & next page
  const numberOfPosts = getNumberOfPosts();
  const numberPerPage = 10;
  // indicate whether it is the first or last page or not
  const totalPage = Math.ceil(numberOfPosts / numberPerPage);

  return {
    props: {
      infos,
      totalPage,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const numberOfPosts = getNumberOfPosts();
  // console.log(numberOfPosts);
  const numberPerPage = 10;
  const paths = Array(Math.ceil(numberOfPosts / numberPerPage))
    .fill(0)
    .map((_, i) => ({
      params: {
        page: String(i + 1),
      },
    }));
  // console.log(paths);

  return {
    paths,
    fallback: false,
  };
};
