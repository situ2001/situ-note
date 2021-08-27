import * as React from 'react';
import { Dispatch, SetStateAction } from 'react';
import MenuItem from './MenuItem';
import * as styles from './style.module.css';

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  location: Location;
};

const Menu = (props: Props) => {
  const { open, setOpen, location } = props;

  const menuItems = [
    ['BLOG', '/blog'],
    ['ABOUT', '/about'],
  ];

  return (
    <>
      {open && (
        <div className={styles.container}>
          <button
            className={styles.btnClose}
            type="button"
            onClick={() => setOpen(false)}
          >
            <svg viewBox="0 0 40 40">
              <path stroke="black" d="M 10,10 L 30,30 M 30,10 L 10,30" />
            </svg>
          </button>
          <div className={styles.nav}>
            <ul style={{ listStyle: 'none' }}>
              {menuItems.map(([title, link]) => (
                <li className={styles.navLinkItem} key={title}>
                  <MenuItem
                    title={title}
                    to={link}
                    isActivate={location.pathname.includes(link)}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default Menu;
