import type { MarkdownHeading } from "astro";

export const TableOfContent = ({
  headings,
}: {
  headings: MarkdownHeading[];
}) => {
  // map depth => depth - 2, with minimum 0
  headings = headings.map((heading) => ({
    ...heading,
    depth: Math.max(heading.depth - 2, 0),
  }));

  return (
    <div>
      {headings.map((heading) => {
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
