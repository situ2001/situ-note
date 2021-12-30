import React from "react";
import { MDXRemote } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import { getAllPosts, getPostBySlug } from "../../lib/api";
import { Typography } from "@mui/material";
import Image from "next/image";

export default function Post({ source, frontMatter, path }: any) {
  const components = {
    h2: (props: any) => <Typography variant="h2" {...props} />,
    img: ({ src, alt }: { src: string; alt: string }) => {
      src = src.slice(2);
      return (
        <div style={{ width: "100%", height: "75vh", position: "relative" }}>
          <Image
            alt={alt}
            src={`${path}${src}`}
            objectFit="contain"
            layout="fill"
            loading="lazy"
          />
        </div>
      );
    },
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
