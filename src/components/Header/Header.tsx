import React from 'react';
import { Link } from 'gatsby';
import HeaderLink from './HeaderLink';
import * as styles from './style.module.css';

type Props = {
  location: Location;
};

const Header = (props: Props) => {
  const { location } = props;

  const listItems = [
    ['BLOG', '/blog'],
    ['ABOUT', '/about'],
  ];

  return (
    <div className={styles.header}>
      <p>
        <Link to="/" className={styles.siteTitle}>
          Situ Note
        </Link>
      </p>
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
  );
};

export default Header;
