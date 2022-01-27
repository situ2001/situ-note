import { Box, Container } from "@mui/material";
import { GetStaticPaths, GetStaticProps } from "next";
import Layout from "../../../components/Layout";
import PaginationBar from "../../../components/PaginationBar";
import PostInfoCard from "../../../components/PostInfoCard";
import { getNumberOfPosts, getPostList } from "../../../lib/api";

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
