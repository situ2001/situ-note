import React from 'react';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import { MDXProvider } from '@mdx-js/react';
import type { HeadingResult, HeadingRaw } from '../utils/blog';
import { getFormattedHeadings } from '../utils/blog';
import Layout from '../components/Layout';
import Container from '../components/Container';
import * as styles from '../styles/mdx.module.css';

// customized MDX components
const MyImg = (props) => (
  <img className={styles.myImg} alt="" {...props} />
);

type MyHeadingComponentProps = {
  children: JSX.Element[] | JSX.Element,
};

const MyH2 = (props: MyHeadingComponentProps) => {
  const { children } = props;
  return (
    <h2 id={children.toString()} {...props}>
      {children}
    </h2>
  );
};

const MyH3 = (props: MyHeadingComponentProps) => {
  const { children } = props;
  return (
    <h3 id={children.toString()} {...props}>
      {children}
    </h3>
  );
};

const MyH4 = (props: MyHeadingComponentProps) => {
  const { children } = props;
  return (
    <h4 id={children.toString()} {...props}>
      {children}
    </h4>
  );
};

const MyBlockquote = (props) => (
  <blockquote className={styles.myBlockquote} {...props} />
);

const components = {
  img: MyImg,
  h2: MyH2,
  h3: MyH3,
  h4: MyH4,
  blockquote: MyBlockquote,
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

  // eslint-disable-next-line consistent-return
  return (
    <ol>
      {
        listItems.map((item) => (
          <li key={`${item.value}${item.depth}`}>
            <a className={styles.listAnchor} href={`#${item.value}`}>{item.value}</a>
            {createHeadingList(item.children)}
          </li>
        ))
      }
    </ol>
  );
};

type SideBarProps = {
  headings: HeadingRaw[],
};

// SideBar component
const SideBar = (props: SideBarProps) => {
  const { headings } = props;
  const headingsResult = getFormattedHeadings(headings);

  return (
    <div className={styles.sidebar}>
      {createHeadingList(headingsResult)}
    </div>
  );
};

type ComponentProps = {
  pageContext: {
    title: string,
    date: string,
    body: string,
    slug: string,
    mdxAST: any,
  },
  location: Location,
};

export default function Component({ pageContext, location }: ComponentProps) {
  // both of their types are string
  const {
    mdxAST, title, date, body,
  } = pageContext;

  const headingsFromMdxAST: HeadingRaw[] = mdxAST
    .children.filter((node) => node.type === 'heading')
    .map((heading) => ({ depth: heading.depth, value: heading.children[0].value }));

  return (
    <Layout location={location}>
      <Container>
        <div className={styles.postBox}>
          <div className={styles.content}>
            <h1>{title}</h1>
            <p>
              Posted:
              {date}
            </p>
            <hr />
            <MDXProvider components={components}>
              <MDXRenderer>{body}</MDXRenderer>
            </MDXProvider>
          </div>
          <SideBar headings={headingsFromMdxAST} />
        </div>
      </Container>
    </Layout>
  );
}
