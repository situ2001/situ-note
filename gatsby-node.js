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
        }
      }
    }
  `);

  // read all posts
  data.allMdx.nodes.forEach(node => {
    const pathName = node.frontmatter.permalink ?? `/${node.parent.name}` ?? null;
    const body = node.body;
    const title = node.frontmatter.title;
    const date = node.frontmatter.date;

    if (pathName) {
      actions.createPage({
        path: `/blog${pathName}`,
        component: require.resolve(`${__dirname}/src/templates/blog.js`),
        context: {
          slug: pathName,
          body: body,
          title: title,
          date: date,
        },
      });
    }
  });
};
