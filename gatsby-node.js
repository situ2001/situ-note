exports.createPages = async ({ actions, graphql }) => {
  const blogPost = require.resolve(`${__dirname}/src/templates/blog-post.tsx`);
  const postList = require.resolve(`${__dirname}/src/templates/paginated-blog-post-list.tsx`);

  // query (typeof data === 'object')
  const { data } = await graphql(`
    {
      allMdx(sort: {order: DESC, fields: frontmatter___date}) {
        nodes {
          parent {
            ... on File {
              name
            }
          }
          id
          frontmatter {
            date(formatString: "YYYY-MM-DD")
            permalink
            title
          }
        }
      }
    }
  `);

  // read all blog posts
  const postCount = data.allMdx.nodes.length;
  data.allMdx.nodes.forEach((node, i) => {
    const pathName = `/blog/${node.frontmatter.permalink ?? node.parent.name ?? null}`;
    const { id } = node;
    const { title, date } = node.frontmatter;

    const prev = {};
    if (i > 0) {
      const prevNode = data.allMdx.nodes[i - 1];
      prev.title = `Prev: ${prevNode.frontmatter.title}`;
      prev.to = `/blog/${prevNode.frontmatter.permalink ?? prevNode.parent.name ?? null}`;
    }

    const next = {};
    if (i < postCount - 1) {
      const nextNode = data.allMdx.nodes[i + 1];
      next.title = `Next: ${nextNode.frontmatter.title}`;
      next.to = `/blog/${nextNode.frontmatter.permalink ?? nextNode.parent.name ?? null}`;
    }

    if (pathName) {
      actions.createPage({
        path: pathName,
        component: blogPost,
        context: {
          prev,
          next,
          title,
          date,
          id,
        },
      });
    }
  });

  // create paginated list for blog posts
  const maxPostsPerPage = 10;
  const pageCount = Math.ceil(postCount / maxPostsPerPage);
  Array(pageCount).fill(undefined).forEach((_, i) => {
    actions.createPage({
      path: i === 0 ? '/blog' : `/blog/page/${i + 1}`,
      component: postList,
      context: {
        totalPage: pageCount,
        currentPage: i + 1,
        limit: maxPostsPerPage,
        skip: maxPostsPerPage * i,
      },
    });
  });
};
