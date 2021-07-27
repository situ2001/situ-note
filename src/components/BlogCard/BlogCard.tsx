import { Link } from 'gatsby';
import * as React from 'react';
import * as styles from './style.module.css';

type Props = {
  title: string;
  date: string;
  link: string;
};

const BlogCard = ({ title, date, link }: Props) => (
  <div className={styles.container}>
    <Link to={link} className={styles.title}>{title}</Link>
    <p>
      Posted:
      {date}
    </p>
    <Link to={link} className={styles.btn}>Read</Link>
  </div>
);

export default BlogCard;
