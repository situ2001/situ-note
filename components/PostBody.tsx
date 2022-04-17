/* eslint-disable @next/next/no-img-element */
import { ReactNode } from "react";
import type { BlogPostProps } from "../types/BlogPost";
import ReactMarkdown from "react-markdown";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  a11yLight,
  a11yDark,
} from "react-syntax-highlighter/dist/cjs/styles/hljs";
import { CodeProps, OrderedListProps } from "react-markdown/lib/ast-to-react";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

const components: Record<string, any> = {
  h2: (props: any) => (
    <h2 className="text-3xl font-semibold mt-8 mb-4" {...props} />
  ),
  h3: (props: any) => <h3 className="text-2xl mt-6 mb-4" {...props} />,
  h4: (props: any) => <h4 className="text-xl mt-6 mb-4" {...props} />,
  p: (props: any) => <p className="my-4" {...props} />,
  a: (props: any) => <a className="break-all underline" {...props} />,
  ol: ({ ordered, ...props }: OrderedListProps) => (
    <ol className="list-decimal list-inside my-4" {...props} />
  ),
  ul: (props: any) => <ul className="list-disc list-inside my-4" {...props} />,
  blockquote: (props: any) => (
    <blockquote
      className="px-4 border-zinc-200 border-l-4 border-solid"
      {...props}
    />
  ),
  code({ node, inline, className, children, ...props }: CodeProps) {
    const match = /language-(\w+)/.exec(className || "");
    return !inline && match ? (
      <SyntaxHighlighter
        style={a11yLight}
        language={match[1]}
        PreTag="div"
        {...props}
      >
        {String(children).replace(/\n$/, "")}
      </SyntaxHighlighter>
    ) : (
      <code className={`${className ?? ""}bg-zinc-100 rounded`} {...props}>
        {children}
      </code>
    );
  },
  img: (props: any) => {
    return (
      <div className="flex justify-center">
        <img className="rounded-xl" src={props.src} alt={props.alt} />
      </div>
    );
  },
};

export default function PostBody({ content }: BlogPostProps) {
  return (
    <ReactMarkdown
      components={components}
      remarkPlugins={[[remarkGfm, { singleTilde: false }], remarkMath]}
      rehypePlugins={[rehypeKatex]}
    >
      {content}
    </ReactMarkdown>
  );
}
