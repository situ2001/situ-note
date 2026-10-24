import { createMarkdownProcessor } from "@astrojs/markdown-remark";
import { expect, test } from "vitest";
import config from "../astro.config.mjs";

const processor = await createMarkdownProcessor({
  ...config.markdown.processor.options,
  syntaxHighlight: false,
});

test("the article cover renders its alt text as a caption below the image", async () => {
  const { code } = await processor.render("![封面：我们看着离月亮这么近，但又离月亮这么远](./assets/to_the_moon.jpeg)");

  expect(code).toMatch(/<figure><img[^>]+><figcaption>封面：我们看着离月亮这么近，但又离月亮这么远<\/figcaption><\/figure>/);
  expect(code).toContain('alt="封面：我们看着离月亮这么近，但又离月亮这么远"');
});

test("linked images retain their link and get a caption", async () => {
  const { code } = await processor.render("[![A diagram](/diagram.png)](https://example.com)");

  expect(code).toBe('<figure><a href="https://example.com"><img src="/diagram.png" alt="A diagram"></a><figcaption>A diagram</figcaption></figure>');
});

test("empty alt text and inline images do not generate captions", async () => {
  const { code } = await processor.render("![](/decoration.png)\n\nText ![inline](/inline.png) continues.");

  expect(code).not.toContain("<figure>");
  expect(code).not.toContain("<figcaption>");
  expect(code).toContain('alt="inline"');
});

test("caption text is escaped and preserves the image alt", async () => {
  const { code } = await processor.render("![<script>alert(1)</script> & description](/image.png)");

  expect(code).toContain('alt="<script>alert(1)</script> &#x26; description"');
  expect(code).toContain("<figcaption>&#x3C;script>alert(1)&#x3C;/script> &#x26; description</figcaption>");
  expect(code).not.toContain("<figcaption><script>");
});
