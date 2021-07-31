import { Link } from 'gatsby';
import * as React from 'react';
import * as styles from './style.module.css';

type Props = {
  title: string;
  date: string;
  link: string;
  description: string | null;
};

const BlogCard = ({
  title, date, link, description,
}: Props) => (
  <div className={styles.container}>
    <div className={styles.leftCard}>
      <Link to={link} className={styles.title}>{title}</Link>
      <p>
        Posted:
        {date}
      </p>
      <p>{description || 'Author is so lazy that he left nothing here.'}</p>
    </div>
    <div className={styles.rightCard}>
      <Link to={link} className={styles.btn}>{'>> Read'}</Link>
    </div>
  </div>
);

export default BlogCard;
