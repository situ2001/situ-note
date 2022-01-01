import React, { ReactNode } from "react";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeReact from "rehype-react";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeDocument from "rehype-document";
import rehypeHighlight from "rehype-highlight";

export function processor(components: Record<string, ReactNode>) {
  return unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeHighlight)
    .use(remarkMath)
    .use(rehypeKatex)
    .use(rehypeDocument, {
      css: [],
    })
    .use(rehypeReact, {
      createElement: React.createElement,
      components: components,
    });
}
