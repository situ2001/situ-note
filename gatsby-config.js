module.exports = {
  siteMetadata: {
    title: 'Situ Note',
    author: 'situ2001',
    dateFormat: 'YYYY-MM-DD',
  },
  plugins: [
    {
      resolve: 'gatsby-plugin-mdx',
      options: {
        extensions: ['.mdx', '.md'],
        gatsbyRemarkPlugins: [
          {
            resolve: 'gatsby-remark-prismjs',
            options: {
              classPrefix: 'language-',
              inlineCodeMarker: {
                tsx: 'tsx',
              },
              aliases: {},
            },
          },
        ],
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'blogs',
        path: `${__dirname}/contents`,
      },
    },
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        icon: './src/images/logo.svg',
      },
    },
  ],
};
