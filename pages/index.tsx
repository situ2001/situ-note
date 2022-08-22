import type { GetStaticProps, NextPage } from "next";
import { parse } from "node-html-parser";
import Layout from "../components/Layout";
import PersonalCard from "../components/PersonalCard";
import useDocumentTitle from "../hooks/useDocumentTitle";

const Home: NextPage = (props: any) => {
  useDocumentTitle("Home");

  const { githubStat } = props;

  return (
    <Layout flex center>
      <PersonalCard githubStat={githubStat} />
    </Layout>
  );
};

export const getStaticProps: GetStaticProps<any> = async () => {
  const data = await fetch(
    "https://github-readme-stats.vercel.app/api?username=situ2001&include_all_commits=true&count_private=true"
  );
  const html = await data.text();
  const root = parse(html);
  const stars = root.querySelector("[data-testid=stars]")?.innerHTML;
  const prs = root.querySelector("[data-testid=prs]")?.innerHTML;
  const issues = root.querySelector("[data-testid=issues]")?.innerHTML;
  const contributeTo = root.querySelector("[data-testid=contribs]")?.innerHTML;

  const githubStat = { stars, prs, issues, contributeTo };

  return {
    props: { githubStat },
    revalidate: 7200,
  };
};

export default Home;
