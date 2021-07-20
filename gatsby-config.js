module.exports = {
  siteMetadata: {
    title: "Situ Note",
    author: "situ2001",
  },
  plugins: [
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        extensions: [`.mdx`, `.md`],
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `blogs`,
        path: `${__dirname}/contents`,
      },
    },
  ],
};
