import React from 'react';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import Layout from '../components/Layout';
import Container from '../components/Container';

export default function Component({ pageContext, location }) {
  return (
    <Layout location={location}>
      <Container>
        <div>
          <h1>{pageContext.title}</h1>
          <p>Posted: {pageContext.date}</p>
          <hr/>
          <MDXRenderer>
            {pageContext.body}
          </MDXRenderer>
        </div>
      </Container>
    </Layout>
  );
};
