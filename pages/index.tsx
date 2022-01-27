import type { NextPage } from "next";
import Layout from "../components/Layout";
import useDocumentTitle from "../hooks/useDocumentTitle";

const Home: NextPage = () => {
  useDocumentTitle("Home");

  return (
    <Layout>
      <></>
    </Layout>
  );
};

export default Home;
