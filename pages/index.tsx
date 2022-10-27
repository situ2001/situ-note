import type { GetStaticProps, NextPage } from "next";
import { parse } from "node-html-parser";
import Layout from "../components/Layout";
import PersonalCard from "../components/PersonalCard";
import useDocumentTitle from "../hooks/useDocumentTitle";

const Home: NextPage = (props: any) => {
  useDocumentTitle("Home");

  return (
    <Layout flex hideHeader hideFooter>
      <PersonalCard />
    </Layout>
  );
};

export default Home;
