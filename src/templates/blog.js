import React from 'react';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import { MDXProvider } from "@mdx-js/react"
import Layout from '../components/Layout';
import Container from '../components/Container';
import * as styles from '../styles/mdx.module.css';

// customized MDX components
const MyImg = (props) => (
  <img 
    className={styles.myImg}
    alt=""
    {...props}
  />
);

const MyCode = (props) => (
  <code
    style={{ whiteSpace: 'pre-wrap' }}
    {...props}
  />
);

const MyH2 = (props) => (
  <h2
    id={props.children}
    {...props}
  >
    {props.children}
  </h2>
);

const MyH3 = (props) => (
  <h3
    id={props.children}
    {...props}
  >
    {props.children}
  </h3>
);

const MyH4 = (props) => (
  <h4
    id={props.children}
    {...props}
  >
    {props.children}
  </h4>
);

const components = {
  img: MyImg,
  code: MyCode,
  h2: MyH2,
  h3: MyH3,
  h4: MyH4,
};

// get formatted headings for headingList
const getFormattedHeadings = (headings) => {
  const o = [];
  for (const heading of headings) {
    heading.children = [];
    if (heading.depth === 2) {
      o.push(heading);
    } else {
      o[o.length - 1].children.push(heading);
    }
  }

  return o;
};

const createHeadingList = (listItems) => {
  if (listItems === null) {
    return;
  }

  return (
    <ol>
      {
        listItems.map(item => (
          <li key={`${item.value}${item.depth}`}>
            <a className={styles.listAnchor} href={`#${item.value}`}>{item.value}</a>
            {createHeadingList(item.children)}
          </li>
        ))
      }
    </ol>
  )
};

const SideBar = ({ headings }) => {
  return (
    <div className={styles.sidebar}>
      {createHeadingList(headings)}
    </div>
  )
};

export default function Component({ pageContext, location }) {
  const { mdxAST, title, date, body } = pageContext;
  
  const headings = mdxAST.children.filter(node => node.type === 'heading');
  const headingsRes = headings.map(heading => ({ depth: heading.depth, value: heading.children[0].value }));
  const headingList = getFormattedHeadings(headingsRes);

  return (
    <Layout location={location}>
      <Container>
        <div className={styles.postBox}>
          <div className={styles.content}>
            <h1>{title}</h1>
            <p>Posted: {date}</p>
            <hr/>
            <MDXProvider components={components}>
              <MDXRenderer>{body}</MDXRenderer>
            </MDXProvider>
          </div>
          <SideBar headings={headingList} />
        </div>
      </Container>
    </Layout>
  );
};
