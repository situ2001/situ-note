// type for Heading
export type HeadingRaw = {
  value: string,
  depth: number,
};

export type HeadingResult = {
  value: string,
  depth: number,
  children: HeadingResult[],
};

// a function that perform HeadingRaw => HeadingResult
export const getFormattedHeadings = (headings: HeadingRaw[]): HeadingResult[] => {
  const o = [];
  for (let i = 0; i < headings.length; i += 1) {
    const heading = headings[i];
    if (heading.depth !== 1) {
      // eslint-disable-next-line dot-notation
      heading['children'] = [];
      if (heading.depth === 2) {
        o.push(heading as HeadingResult);
      } else {
        o[o.length - 1].children.push(heading as HeadingResult);
      }
    }
  }

  return o;
};
