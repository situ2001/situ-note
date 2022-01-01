import React, { ReactNode } from "react";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeReact from "rehype-react";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeDocument from "rehype-document";
import rehypeHighlight from "rehype-highlight";
import groovy from "highlight.js/lib/languages/groovy";
import powershell from "highlight.js/lib/languages/powershell";
import remarkGfm from "remark-gfm";

export function processor(components: Record<string, ReactNode>) {
  return unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeHighlight, { languages: { groovy, powershell } })
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
