import * as React from 'react';
import { Dispatch, SetStateAction } from 'react';
import MenuItem from './MenuItem';

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
      <div
        className={`fixed w-full z-20 overflow-x-hidden bg-white opacity-95 ${
          open ? 'visible h-full' : 'invisible h-0'
        } transition-all delay-100
        `}
      >
        <button
          className="bg-transparent w-12 right-4 top-4 fixed"
          type="button"
          onClick={() => setOpen(false)}
        >
          <svg viewBox="0 0 40 40" className="cursor-pointer">
            <path stroke="black" d="M 10,10 L 30,30 M 30,10 L 10,30" />
          </svg>
        </button>
        <div className="h-full flex flex-col justify-center items-center">
          <ul style={{ listStyle: 'none' }}>
            {menuItems.map(([title, link]) => (
              <li className="my-4" key={title}>
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
    </>
  );
};

export default Menu;
