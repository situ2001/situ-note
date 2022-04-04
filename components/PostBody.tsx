/* eslint-disable @next/next/no-img-element */
import { ReactNode } from "react";
import { markdownProcessor } from "../lib/markdown-processor";
import type { BlogPostProps } from "../types/BlogPost";
import "katex/dist/katex.min.css";
import "highlight.js/styles/stackoverflow-light.css"; // TODO fix styles of <block>
import React from "react";
import rehypeReact from "rehype-react";

const components: Record<string, ReactNode> = {
  h2: (props: any) => (
    <h2 className="text-3xl font-semibold mt-8 mb-4" {...props} />
  ),
  h3: (props: any) => <h3 className="text-2xl mt-6 mb-4" {...props} />,
  h4: (props: any) => <h4 className="text-xl mt-6 mb-4" {...props} />,
  p: (props: any) => <p className="my-4" {...props} />,
  a: (props: any) => <a className="break-all underline" {...props} />,
  ol: (props: any) => (
    <ol className="list-decimal list-inside my-4" {...props} />
  ),
  ul: (props: any) => <ul className="list-disc list-inside my-4" {...props} />,
  blockquote: (props: any) => (
    <blockquote
      className="px-4 border-zinc-200 border-l-4 border-solid"
      {...props}
    />
  ),
  code: (props: any) => <code className="bg-zinc-100 rounded" {...props} />,
  img: (props: any) => {
    return (
      <div className="flex justify-center">
        <img className="rounded-xl" src={props.src} alt={props.alt} />
      </div>
    );
  },
};

const processor = markdownProcessor.use(rehypeReact, {
  createElement: React.createElement,
  components: components,
});

export default function PostBody({ content }: BlogPostProps) {
  return <article>{processor.processSync(content).result}</article>;
}
