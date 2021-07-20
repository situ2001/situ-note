import * as React from 'react';
import * as styles from './style.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      Made with ❤ by&nbsp;
      <a
        href="https://www.github.com/situ2001"
        style={{ color: 'black', textDecoration: 'none' }}
      >
        situ2001
      </a>
    </footer>
  );
};

export default Footer;