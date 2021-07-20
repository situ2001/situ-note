import * as React from 'react';
import * as styles from './style.module.css';

const Container = ({ children }) => {
  return (
    <div className={styles.container}>
      {children}
    </div>
  )
};

export default Container;