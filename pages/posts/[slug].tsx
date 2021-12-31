import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import { getAllPosts, getPostBySlug } from "../../lib/api";
import { Typography } from "@mui/material";
import Image from "next/image";
import { GetStaticPaths, GetStaticProps } from "next";
import type { Props } from "../../types/BlogPost";

const Img = (mapImageNameToSize: any, path: any) => {
  return function MyImg({ src, alt }: { src: string; alt: string }) {
    src = src.slice(2);
    const { height, width } = mapImageNameToSize[src];
    // console.log("Size", height, width);
    // TODO: https://kylepfromer.com/blog/nextjs-image-component-blog
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          margin: "8px 25vw",
          position: "relative",
        }}
      >
        <Image
          alt={alt}
          src={`${path}${src}`}
          height={height}
          width={width}
          objectFit="contain"
          loading="lazy"
        />
      </div>
    );
  };
};

export default function Post({
  source,
  frontMatter,
  path,
  mapImageNameToSize,
}: Props) {
  // console.log(mapImageNameToSize);

  const components = {
    h2: (props: any) => <Typography variant="h2" {...props} />,
    img: Img(mapImageNameToSize, path),
  };

  return (
    <>
      <div>
        <Typography component="div" variant="h4">
          {frontMatter.title}
        </Typography>
        <MDXRemote {...source} components={components} lazy />
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps<Props> = async ({
  params,
}: any) => {
  const post = getPostBySlug(params.slug);

  const mdxSource = await serialize(post.content, { scope: post.data });

  return {
    props: {
      source: mdxSource,
      frontMatter: post.data,
      path: post.path,
      mapImageNameToSize: post.mapImageNameToSize,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = getAllPosts();

  return {
    paths: slugs.map((slug) => ({
      params: {
        slug: slug,
      },
    })),
    fallback: false,
  };
};
