import type { NextPage } from "next";
import Layout from "../components/Layout";
import useDocumentTitle from "../hooks/useDocumentTitle";

const Home: NextPage = () => {
  useDocumentTitle("Home");

  return (
    <Layout>
      <div>
        <div>
          <div>Welcome to my blog</div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
