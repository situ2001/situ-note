import React from "react";
import { MDXRemote } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import { getAllPosts, getPostBySlug } from "../../lib/api";
import { Typography } from "@mui/material";
import Image from "next/image";

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
}: any) {
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

export async function getStaticProps({ params }: any) {
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
}

export async function getStaticPaths() {
  const slugs = getAllPosts();

  return {
    paths: slugs.map((slug) => ({
      params: {
        slug: slug,
      },
    })),
    fallback: false,
  };
}
