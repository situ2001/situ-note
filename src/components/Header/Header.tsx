import React, { Dispatch, SetStateAction } from 'react';
import { Link } from 'gatsby';
import * as styles from './style.module.css';

type Props = {
  setOpen: Dispatch<SetStateAction<boolean>>,
};

const Header = (props: Props) => {
  const { setOpen } = props;

  return (
    <div className={styles.header}>
      <p>
        <Link to="/" className={styles.siteTitle}>
          Situ Note
        </Link>
      </p>
      <nav>
        <ul className={styles.navLinkList}>
          <li className={styles.navLinkItem} key={114514}>
            <button className={styles.btnMenu} type="button" onClick={() => setOpen(true)}>
              <div />
              <div />
              <div />
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Header;
