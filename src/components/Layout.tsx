import * as React from 'react';
import { Link } from 'gatsby';
import * as styles from '../styles/layout.module.css';
import HeaderLink from './HeaderLink';

type Props = {
  location: Location;
  children?: JSX.Element[] | JSX.Element;
  title?: string;
};

const Layout = (props: Props) => {
  const { children, location } = props;

  const listItems = [
    ["BLOG", "/blog"],
    ["ABOUT", "/about"],
  ];  

  return (
    <main>

      <title>Situ Note</title>
      
      <div className={styles.container}>

        <div className={styles.header}>
          <p>
            <Link to="/" className={styles.siteTitle}>
              Situ Note
            </Link>
          </p>
          <div className={styles.hiddenBlock} />
          <nav>
            <ul className={styles.navLinkList}>
              {
                listItems.map(([title, link]) => (
                  <li className={styles.navLinkItem} key={title}>
                    <HeaderLink title={title} to={link} isActivate={location.pathname.includes(link)} />
                  </li>
                ))
              }
            </ul>
          </nav> 
        </div>
      
      {children}

      </div>
      
    </main>
  );
}

export default Layout;