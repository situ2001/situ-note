import React from 'react';
import { Link } from 'gatsby';

type Props = {
  isActivate: boolean;
  title: string;
  to: string;
};

const MenuItem = (props: Props) => {
  const { to, title, isActivate } = props;
  return (
    <Link
      to={to}
      className={`hover:bg-pink-200 text-black transition-colors duration-300 text-4xl ${
        isActivate ? 'bg-pink-200' : ''
      }`}
    >
      {title}
      {isActivate && <span style={{ backgroundColor: 'pink' }} />}
    </Link>
  );
};

export default MenuItem;
