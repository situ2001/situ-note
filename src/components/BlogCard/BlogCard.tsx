import { Link } from 'gatsby';
import * as React from 'react';
import * as styles from './style.module.css';

type Props = {
  title: string;
  date: string;
  link: string;
};

const BlogCard = (props: Props) => {
  return (
    <div className={styles.container}>
      <Link to={props.link} className={styles.title}>{props.title}</Link>
      <p>Posted: {props.date}</p>
    </div>
  );
};

export default BlogCard;