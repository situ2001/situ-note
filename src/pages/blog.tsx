import * as React from 'react';
import { graphql, Link } from 'gatsby';
import Layout from '../components/Layout';

type Props = {
  location: Location;
  data: any; // TODO
};

const Blog = (props: Props) => {
  const { data, location } = props;

  return (
    <Layout location={location}>
      {
        data.allMdx.nodes.map(node => {
          let link: string = node.frontmatter.permalink ?? `/${node.parent.name}` ?? null;
          link = `/blog${link}`;
          return (
            <article key={node.id}>
              <Link to={link}>{node.frontmatter.title}</Link>
            </article>
          );
        })
      }
    </Layout>
  );
}

export default Blog;

export const query = graphql`
  {
    allMdx {
      nodes {
        parent {
          ... on File {
            name
          }
        }
        id
        body
        frontmatter {
          date(formatString: "MMMM D, YYYY")
          permalink
          title
        }
      }
    }
  }
`;