import React from 'react';
import { MDXRenderer } from 'gatsby-plugin-mdx';

export default function Component({ pageContext }) {
  return (
    <main>
      <h1>{pageContext.slug}</h1>
      <MDXRenderer>
        {pageContext.body}
      </MDXRenderer>
    </main>
  );
};
