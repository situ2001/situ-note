exports.createPages = async ({ actions, graphql }) => {
  const blogPost = require.resolve(`${__dirname}/src/templates/blog-post.tsx`);
  const postList = require.resolve(`${__dirname}/src/templates/paginated-blog-post-list.tsx`);

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

  // read all blog posts
  data.allMdx.nodes.forEach((node) => {
    const pathName = node.frontmatter.permalink ?? `/${node.parent.name}` ?? null;
    const { id } = node;
    const { title, date } = node.frontmatter;

    if (pathName) {
      actions.createPage({
        path: `/blog${pathName}`,
        component: blogPost,
        context: {
          title,
          date,
          id,
        },
      });
    }
  });
};
