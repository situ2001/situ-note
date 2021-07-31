import * as React from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/Layout';
import Container from '../components/Container';
import BlogCard from '../components/BlogCard';
import Pagination from '../components/Pagination';

type Props = {
  data: {
    allMdx: {
      nodes: {
        id: string,
        frontmatter: {
          date: string,
          title: string,
          permalink: string,
          description?: string
        },
        parent: {
          name: string,
        },
      }[],
    }
  },
  pageContext: {
    totalPage: number,
    currentPage: number,
    limit: number,
    skip: number,
  },
  location: Location,
};

export default function Component({ data, pageContext, location }: Props) {
  const { totalPage, currentPage } = pageContext;
  return (
    <Layout location={location}>
      <Container>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {
            data.allMdx.nodes.map((node) => {
              let link: string = `/${node.frontmatter.permalink ?? node.parent.name ?? null}`;
              link = `/blog${link}`;
              const { title, date, description } = node.frontmatter;
              return (
                <BlogCard
                  title={title}
                  link={link}
                  date={date}
                  description={description}
                  key={node.id}
                />
              );
            })
          }
          <Pagination
            prevTo={currentPage === 2 ? '/blog' : `/blog/page/${currentPage - 1}`}
            prevText={currentPage !== 1 ? '< Prev' : null}
            nextTo={currentPage !== totalPage ? `/blog/page/${currentPage + 1}` : null}
            nextText={currentPage !== totalPage ? 'Next >' : null}
            currentText={`Page ${currentPage}`}
          />
        </div>
      </Container>
    </Layout>
  );
}

export const query = graphql`
  query PaginatedBlogPostList($limit: Int, $skip: Int) {
    allMdx(skip: $skip, limit: $limit, sort: {order: DESC, fields: frontmatter___date}) {
      nodes {
        id
        frontmatter {
          date(formatString: "YYYY-MM-DD")
          title
          permalink
          description
        }
        parent {
          ... on File {
            name
          }
        }
      }
    }
  }
`;
