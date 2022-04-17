import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import groovy from "highlight.js/lib/languages/groovy";
import powershell from "highlight.js/lib/languages/powershell";
import remarkGfm from "remark-gfm";

export const markdownProcessor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeHighlight, { languages: { groovy, powershell } })
  .use(remarkMath)
  .use(rehypeKatex)
  
