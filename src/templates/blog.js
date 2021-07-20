import React from 'react';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import { MDXProvider } from "@mdx-js/react"
import Layout from '../components/Layout';
import Container from '../components/Container';
import * as styles from '../styles/mdx.module.css';

const MyImg = (props) => (
  <img 
    className={styles.myImg}
    alt=""
    {...props}
  />
);

const components = {
  img: MyImg,
};

export default function Component({ pageContext, location }) {
  return (
    <Layout location={location}>
      <Container>
        <div>
          <h1>{pageContext.title}</h1>
          <p>Posted: {pageContext.date}</p>
          <hr/>
          <MDXProvider components={components}>
            <MDXRenderer>{pageContext.body}</MDXRenderer>
          </MDXProvider>
        </div>
      </Container>
    </Layout>
  );
};
