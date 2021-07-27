// type for Heading
export type HeadingRaw = {
  value: string,
  depth: number,
  children?: HeadingRaw[],
};

export type HeadingResult = {
  depth: number,
  value: string,
  children: HeadingResult[],
};

// a function that perform HeadingRaw => HeadingResult
export const getFormattedHeadings = (headings: HeadingRaw[]): HeadingResult[] => {
  const o = Array<HeadingResult>();
  for (const heading of headings) {
    if (heading.depth === 1) {
      continue;
    }

    heading.children = [];
    if (heading.depth === 2) {
      o.push(heading as HeadingResult);
    } else {
      o[o.length - 1].children.push(heading as HeadingResult);
    }
  }

  return o;
};