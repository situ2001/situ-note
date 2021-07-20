import React from 'react';
import { MDXProvider } from '@mdx-js/react';

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
