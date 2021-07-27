import * as React from 'react';
import * as styles from './style.module.css';

type Props = {
  children: JSX.Element | JSX.Element[],
}

const Container = ({ children }: Props) => (
  <div className={styles.container}>
    {children}
  </div>
);

export default Container;
