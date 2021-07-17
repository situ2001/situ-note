exports.createPages = async function ({ actions, graphql }) {
  // query (typeof data === 'object')
  const { data } = await graphql(`
    {
      allMdx {
        edges {
          node {
            id
            frontmatter {
              title
              permalink
              date(formatString: "MMMM D, YYYY")
            }
            parent {
              ... on File {
                name
              }
            }
            body
          }
        }
      }
    }
  `);

  // read all posts
  data.allMdx.edges.forEach(({ node }) => {
    const pathName = node.frontmatter.permalink ?? `/${node.parent.name}` ?? null;
    const body = node.body;

    if (pathName) {
      actions.createPage({
        path: pathName,
        component: require.resolve(`${__dirname}/src/templates/blog.js`),
        context: {
          slug: pathName,
          body: body,
        },
      });
    }
  });
};
