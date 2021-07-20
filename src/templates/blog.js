import React from 'react';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import Layout from '../components/Layout';

export default function Component({ pageContext, location }) {
  return (
    <Layout location={location}>
      <div>
        <h1>{pageContext.title}</h1>
        <p>Posted: {pageContext.date}</p>
        <hr/>
        <MDXRenderer>
          {pageContext.body}
        </MDXRenderer>
      </div>
    </Layout>
  );
};
