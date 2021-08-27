import React from 'react';
import { Link } from 'gatsby';
import * as styles from './style.module.css';

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
      className={styles.link}
      style={isActivate ? { backgroundColor: 'pink' } : {}}
    >
      {title}
      {isActivate && <span style={{ backgroundColor: 'pink' }} />}
    </Link>
  );
};

export default MenuItem;
