import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import Loading from "../../components/Loading";
import Pagination from "../../components/Pagination";
import PostInfoCard from "../../components/PostInfoCard";
import useDocumentTitle from "../../hooks/useDocumentTitle";

export default function PostIndex(props: {
  postDetails: any[];
  totalPage: number;
}) {
  const { postDetails, totalPage } = props;

  const { isFallback } = useRouter();

  useDocumentTitle("文章列表");

  if (isFallback) {
    // TODO skeleton
    return <Loading />;
  } else {
    return (
      <Layout>
        <div className="flex justify-center w-full">
          <div className="flex flex-col justify-center items-center w-full max-w-2xl">
            {postDetails.map((info, i) => {
              const { title, date, description, categories } = info.frontMatter;
              const { slug } = info;
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
}

export const getStaticProps: GetStaticProps<any> = async ({ params }) => {
  const json: any[] = await (
    await fetch(`${process.env.API_URL}/posts/page/${params?.index}`)
  ).json();

  const totalPage: number = await (
    await fetch(`${process.env.API_URL}/posts/length`)
  ) // get page count
    .json();

  if (json.length === 0) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      postDetails: json,
      totalPage,
    },
    revalidate: 5,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const totalPage: number = await (
    await fetch(`${process.env.API_URL}/posts/length`)
  ) // get page count
    .json();

  const paths = Array(totalPage)
    .fill(undefined)
    .map((_, i) => String(i + 1));

  return {
    paths: paths.map((index: string) => ({
      params: {
        index,
      },
    })),
    fallback: true,
  };
};
