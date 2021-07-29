import { Link } from 'gatsby';
import * as React from 'react';
import * as styles from './style.module.css';

type Props = {
  prevText: string,
  prevTo: string,
  nextText: string,
  nextTo: string,
  currentText?: string,
}

const Pagination = ({
  prevText, prevTo, nextText, nextTo, currentText,
}: Props) => (
  <nav className={styles.container}>
    <div>
      <Link className={styles.link} to={prevTo}>
        {prevText}
      </Link>
    </div>
    <div>
      {currentText}
    </div>
    <div>
      <Link className={styles.link} to={nextTo}>
        {nextText}
      </Link>
    </div>
  </nav>
);

Pagination.defaultProps = {
  currentText: '',
};

export default Pagination;
