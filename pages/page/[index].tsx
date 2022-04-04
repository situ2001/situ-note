import { GetStaticPaths, GetStaticProps } from "next";
import Layout from "../../components/Layout";
import Pagination from "../../components/Pagination";
import PostInfoCard from "../../components/PostInfoCard";
import useDocumentTitle from "../../hooks/useDocumentTitle";

const NUMBER_PER_PAGE = 10;

export default function PostIndex(props: {
  postDetails: any[];
  totalPage: number;
}) {
  const { postDetails, totalPage } = props;

  useDocumentTitle("文章列表");

  return (
    <Layout>
      <div className="flex justify-center w-full">
        <div className="flex flex-col justify-center items-center w-full max-w-2xl">
          {postDetails.map((info, i) => {
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
          <div className="w-full">
            <Pagination totalPage={totalPage} />
          </div>
        </div>
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps<any> = async ({ params }) => {
  const json: any[] = await (
    await fetch(`https://${process.env.API_URL}/posts/list/infos`)
  ).json();

  const currentPage = Number(params?.index);
  const len = json.length;
  const totalPage = Math.ceil(len / NUMBER_PER_PAGE);

  // TODO slice on server
  const postDetails = json.slice(
    (currentPage - 1) * NUMBER_PER_PAGE,
    currentPage * NUMBER_PER_PAGE
  );

  return {
    props: {
      postDetails,
      totalPage,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const postDetails: any[] = await (
    await fetch(`https://${process.env.API_URL}/posts/list/infos`)
  ).json();

  const len = postDetails.length;
  const totalPage = Math.ceil(len / NUMBER_PER_PAGE);

  const paths = Array(totalPage)
    .fill(undefined)
    .map((_, i) => String(i + 1));

  return {
    paths: paths.map((index: string) => ({
      params: {
        index,
      },
    })),
    fallback: false,
  };
};
