import React from 'react';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import { MDXProvider } from "@mdx-js/react"
import Layout from '../components/Layout';
import Container from '../components/Container';
import * as styles from '../styles/mdx.module.css';

// customized MDX components
const MyImg = (props) => (
  <img className={styles.myImg} alt="" {...props} />
);

const MyH2 = (props) => (
  <h2 id={props.children} {...props}>
    {props.children}
  </h2>
);

const MyH3 = (props) => (
  <h3 id={props.children} {...props}>
    {props.children}
  </h3>
);

const MyH4 = (props) => (
  <h4 id={props.children} {...props}>
    {props.children}
  </h4>
);

const components = {
  img: MyImg,
  h2: MyH2,
  h3: MyH3,
  h4: MyH4,
};

// type for Heading
type HeadingRaw = {
  value: string,
  depth: number,
  children?: HeadingRaw[],
};

type HeadingResult = {
  depth: number,
  value: string,
  children: HeadingResult[],
};

// a function that perform HeadingRaw => HeadingResult
const getFormattedHeadings = (headings: HeadingRaw[]): HeadingResult[] => {
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

/**
 * Recursive function for creating a list of headings
 * @param listItems 
 * @returns JSX.Element
 */
const createHeadingList = (listItems: HeadingResult[]) => {
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

type SideBarProps = {
  headings: HeadingResult[]
};

// SideBar component
const SideBar = (props: SideBarProps) => {
  const { headings } = props;

  return (
    <div className={styles.sidebar}>
      {createHeadingList(headings)}
    </div>
  )
};

export default function Component({ pageContext, location }) {
  // both of their types are string
  const { mdxAST, title, date, body } = pageContext;
  
  const headings = mdxAST.children.filter(node => node.type === 'heading');
  const headingsRaw: HeadingRaw[] = headings.map(heading => ({ depth: heading.depth, value: heading.children[0].value }));
  const headingList = getFormattedHeadings(headingsRaw);

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
