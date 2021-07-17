module.exports = {
  siteMetadata: {
    title: "Situ Note",
    author: "situ2001",
  },
  plugins: [
    `gatsby-plugin-mdx`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `blogs`,
        path: `${__dirname}/contents`,
      },
    },
  ],
};
