import React from 'react';
import { MDXProvider } from '@mdx-js/react';
import * as styles from './src/styles/mdx.module.css';

// import prism theme
require('prism-themes/themes/prism-vs.css');

const MyImg = (props) => (
  <img 
    className={styles.myImg}
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
