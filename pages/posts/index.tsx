import { Container, Pagination, Box, styled } from "@mui/material";
import { GetStaticProps } from "next";
import React, { useState } from "react";
import Layout from "../../components/Layout";
import PostInfoCard from "../../components/PostInfoCard";
import useDocumentTitle from "../../hooks/useDocumentTitle";

const CenteredPagination = styled(Pagination)`
  & .MuiPagination-ul {
    justify-content: center;
  }
`;

export default function PostIndex(props: { postDetails: any[] }) {
  const { postDetails } = props;

  const postNumber = postDetails.length;
  const NUMBER_PER_PAGE = 10;
  const totalPage = Math.ceil(postNumber / NUMBER_PER_PAGE);

  const [currentPage, setCurrentPage] = useState(1);
  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 100);
  };

  useDocumentTitle("文章列表");

  return (
    <Layout>
      <Container maxWidth="md">
        <Box>
          {postDetails
            .slice(
              (currentPage - 1) * NUMBER_PER_PAGE,
              currentPage * NUMBER_PER_PAGE
            )
            .map((info, i) => {
              const { title, date, description, categories, slug } = info;
              return (
                <PostInfoCard
                  key={i}
                  title={title}
                  date={date}
                  description={description}
                  categories={categories}
                  link={`/posts/${slug}`}
                ></PostInfoCard>
              );
            })}
        </Box>
        <CenteredPagination
          count={totalPage}
          page={currentPage}
          onChange={handlePageChange}
          sx={{ my: 2 }}
        />
      </Container>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps<any> = async () => {
  const postDetails: any[] = await (
    await fetch(`https://${process.env.API_URL}/posts/list/infos`)
  ).json();

  return {
    props: {
      postDetails,
    },
  };
};
