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
          frontmatter {
            date(formatString: "MMMM D, YYYY")
            permalink
            title
          }
        }
      }
    }
  `);

  // read all posts
  data.allMdx.nodes.forEach((node) => {
    const pathName = node.frontmatter.permalink ?? `/${node.parent.name}` ?? null;
    const { id } = node;
    const { title, date } = node.frontmatter;

    if (pathName) {
      actions.createPage({
        path: `/blog${pathName}`,
        component: require.resolve(`${__dirname}/src/templates/blog.tsx`),
        context: {
          title,
          date,
          id,
        },
      });
    }
  });
};
