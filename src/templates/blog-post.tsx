/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import { MDXProvider } from '@mdx-js/react';
import { graphql } from 'gatsby';
import type { HeadingResult, HeadingRaw } from '../utils/blog';
import { getFormattedHeadings } from '../utils/blog';
import Layout from '../components/Layout';
import Container from '../components/Container';
import * as styles from '../styles/posts.module.css';
import Pagination from '../components/Pagination';
import {
  H2,
  H3,
  H4,
  Text,
  OrderedList,
  UnorderedList,
  Blockquote,
} from '../components/MDXComponents';

const components = {
  h2: H2,
  h3: H3,
  h4: H4,
  blockquote: Blockquote,
  p: Text,
  ol: OrderedList,
  ul: UnorderedList,
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
      {listItems.map((item) => (
        <li key={`${item.value}${item.depth}`}>
          <a className={styles.listAnchor} href={`#${item.value}`}>
            {item.value}
          </a>
          {createHeadingList(item.children)}
        </li>
      ))}
    </ol>
  );
};

type SideBarProps = {
  headings: HeadingRaw[];
};

// SideBar component
// TODO Make it into a component
// eslint-disable-next-line no-unused-vars
const SideBar = (props: SideBarProps) => {
  const { headings } = props;
  const headingsResult = getFormattedHeadings(headings);

  return (
    <div className={styles.sidebar}>{createHeadingList(headingsResult)}</div>
  );
};

type ComponentProps = {
  pageContext: {
    title: string;
    date: string;
    prev: {
      to: string;
      title: string;
    };
    next: {
      to: string;
      title: string;
    };
  };
  location: Location;
  data: {
    mdx: {
      headings: {
        value: string;
        depth: number;
      }[];
      body: string;
    };
  };
};

// TODO fully used styled component
export default function Component({
  data,
  pageContext,
  location,
}: ComponentProps) {
  const { title, date, prev, next } = pageContext;
  const { body } = data.mdx;

  return (
    <Layout location={location}>
      <Container>
        <div className={styles.postBox}>
          <div className="max-w-screen-md w-screen px-2">
            <h1 className="text-3xl font-extrabold mb-5">{title}</h1>
            <p>
              {'Posted: '}
              {date}
            </p>
            <hr />
            <MDXProvider components={components}>
              <MDXRenderer>{body}</MDXRenderer>
            </MDXProvider>
          </div>
          {/* <SideBar headings={headings} /> */}
        </div>
        <Pagination
          prevText={prev.title}
          prevTo={prev.to}
          nextText={next.title}
          nextTo={next.to}
        />
      </Container>
    </Layout>
  );
}

export const query = graphql`
  query BlogPostByID($id: String) {
    mdx(id: { eq: $id }) {
      body
      headings {
        depth
        value
      }
    }
  }
`;
