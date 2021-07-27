exports.createPages = async function ({ actions, graphql }) {
  // query (typeof data === 'object')
  const { data } = await graphql(`
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
          mdxAST
        }
      }
    }
  `);

  // read all posts
  data.allMdx.nodes.forEach((node) => {
    const pathName = node.frontmatter.permalink ?? `/${node.parent.name}` ?? null;
    const { body, mdxAST } = node;
    const { title, date } = node.frontmatter;

    if (pathName) {
      actions.createPage({
        path: `/blog${pathName}`,
        component: require.resolve(`${__dirname}/src/templates/blog.tsx`),
        context: {
          slug: pathName,
          body,
          title,
          date,
          mdxAST,
        },
      });
    }
  });
};
