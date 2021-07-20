import React from 'react';
import { Link } from 'gatsby';
import * as styles from './style.module.css';

type Props = {
  isActivate: boolean;
  title: string;
  to: string;
};

const HeaderLink = (props: Props) => {
  return (
    <Link to={props.to} className={styles.link} style={props.isActivate ? {backgroundColor: 'pink'} : {}}>
      {props.title}
      {props.isActivate && <span style={{ backgroundColor: "pink" }}></span>}
    </Link>
  );
};

export default HeaderLink;
