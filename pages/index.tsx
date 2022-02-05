import type { NextPage } from "next";
import Layout from "../components/Layout";
import useDocumentTitle from "../hooks/useDocumentTitle";
import EngineeringIcon from "@mui/icons-material/Engineering";
import { Box, Container, Typography } from "@mui/material";

const Home: NextPage = () => {
  useDocumentTitle("Home");

  return (
    <Layout>
      <Container>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <EngineeringIcon sx={{ height: "50%", width: "50%" }} color="disabled" />
          <Typography component="div" variant="h3">仍在开发中</Typography>
          <Typography component="div" variant="h5">阅读博客请点击右上角BLOG</Typography>
        </Box>
      </Container>
    </Layout>
  );
};

export default Home;
