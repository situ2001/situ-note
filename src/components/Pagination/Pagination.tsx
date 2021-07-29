import { Link } from 'gatsby';
import * as React from 'react';
import * as styles from './style.module.css';

type Props = {
  totalPage: number,
  currentPage: number,
}

const Pagination = ({
  totalPage, currentPage,
}: Props) => (
  <nav className={styles.container}>
    <div>
      {(currentPage !== 1) && (
      <Link className={styles.link} to={currentPage === 2 ? '/blog' : `/blog/page/${currentPage - 1}`}>
        {'< '}
        Prev
      </Link>
      )}
    </div>
    <div>
      Page
      {' '}
      {currentPage}
    </div>
    <div>
      {(totalPage !== currentPage) && (
      <Link className={styles.link} to={`/blog/page/${currentPage + 1}`}>
        {'> '}
        Next
      </Link>
      )}
    </div>
  </nav>
);

export default Pagination;
