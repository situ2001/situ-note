import * as React from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/Layout';
import Container from '../components/Container';
import BlogCard from '../components/BlogCard';

type Props = {
  location: Location,
  data: {
    allMdx: {
      nodes: {
        parent: {
          name: string,
        },
        id: string,
        frontmatter: {
          date: string,
          permalink: string,
          title: string,
        },
      }[],
    },
  },
};

const Blog = (props: Props) => {
  const { data, location } = props;

  return (
    <Layout location={location}>
      <Container>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {
            data.allMdx.nodes.map((node) => {
              let link: string = node.frontmatter.permalink ?? `/${node.parent.name}` ?? null;
              link = `/blog${link}`;
              const { title } = node.frontmatter;
              const { date } = node.frontmatter;
              return (
                <BlogCard title={title} link={link} date={date} key={node.id} />
              );
            })
          }
        </div>
      </Container>
    </Layout>
  );
};

export default Blog;

export const query = graphql`
  {
    allMdx(sort: {fields: frontmatter___date, order: DESC}) {
      nodes {
        parent {
          ... on File {
            name
          }
        }
        id
        frontmatter {
          date(formatString: "MMMM D, YYYY")
          permalink
          title
        }
      }
    }
  }
`;
