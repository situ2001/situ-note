import * as React from 'react';
import { Dispatch, SetStateAction } from 'react';
import HeaderLink from '../Header/HeaderLink';
import * as styles from './style.module.css';

type Props = {
  open: boolean,
  setOpen: Dispatch<SetStateAction<boolean>>,
  location: Location,
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
          <button className={styles.btnClose} type="button" onClick={() => setOpen(false)}>CLOSE</button>
          <div className={styles.nav}>
            <ul style={{ listStyle: 'none' }}>
              {
                menuItems.map(([title, link]) => (
                  <li className={styles.navLinkItem} key={title}>
                    <HeaderLink
                      title={title}
                      to={link}
                      isActivate={location.pathname.includes(link)}
                    />
                  </li>
                ))
              }
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default Menu;
