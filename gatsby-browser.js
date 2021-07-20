import React from 'react';
import { MDXProvider } from '@mdx-js/react';

// import prism theme
require('prism-themes/themes/prism-vs.css');

const MyImg = (props) => (
  <img 
    style={{
      display: 'block',
      marginLeft: 'auto',
      marginRight: 'auto',
      width: '80%'
    }}
    alt=""
    {...props}
  />
);

const components = {
  img: MyImg,
};

export const wrapRootElement = ({ element }) => {
  return (
    <MDXProvider components={components}>
      {element}
    </MDXProvider>
  )
};
