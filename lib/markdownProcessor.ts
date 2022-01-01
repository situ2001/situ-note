import React, { ReactNode } from "react";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeReact from "rehype-react";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeDocument from "rehype-document";

export function processor(components: Record<string, ReactNode>) {
  return unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(remarkMath)
    .use(rehypeKatex)
    .use(rehypeDocument, {
      css: "https://cdn.jsdelivr.net/npm/katex@0.15.0/dist/katex.min.css",
    })
    .use(rehypeReact, {
      createElement: React.createElement,
      components: components,
    });
}
