import type { MarkdownHeading } from "astro";

export const TableOfContent = ({
  headings,
}: {
  headings: MarkdownHeading[];
}) => {
  const minHeadingLevel = Math.min(...headings.map((heading) => heading.depth));
  const headingsWithDepthAdjusted = headings.map((heading) => ({
    ...heading,
    depth: Math.max(heading.depth - minHeadingLevel, 0),
  }));

  return (
    <div>
      {headingsWithDepthAdjusted.map((heading) => {
        return (
          <div
            style={{ "padding-left": `${heading.depth}rem` }}
            class={`overflow-hidden overflow-ellipsis whitespace-nowrap underline-offset-4 underline`}
          >
            <a href={`#${heading.slug}`}>{heading.text}</a>
          </div>
        );
      })}
    </div>
  );
};
