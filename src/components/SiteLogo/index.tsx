import { useEffect, useState } from 'react';
import styles from './style.module.css';
import clsx from 'clsx';
import useScrollIdle from '../../lib/useScrollIdle';

// TODO Pick a better font
export default function BrandIcon() {
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up');

  const isScrollIdle = useScrollIdle(1000);

  const clsxParamBasedOnScrollDirection = {
    [styles['transform-year-to-name']]: isScrollIdle,
    [styles['transform-name-to-year']]: !isScrollIdle
  }

  return <div className={
    clsx('relative', styles.container)
  }>
    <div className={clsx(styles['container-year'])}>
      <span className={clsx(styles['year-20'], clsxParamBasedOnScrollDirection)}>
        <span className={clsx(styles.centered)}>2</span>
        <span className={clsx(styles.centered)}>0</span>
      </span>
      <span className={clsx(styles['year-01'], clsxParamBasedOnScrollDirection)}>
        <span className={clsx(styles.centered)}>0</span>
        <span className={clsx(styles.centered)}>1</span>
      </span>
    </div>
    <div>
      <span className={clsx(styles.si, clsxParamBasedOnScrollDirection)}>
        <span className={clsx(styles.centered)}>S</span>
        <span className={clsx(styles.centered)}>I</span>
      </span>
      <span className={clsx(styles.tu, clsxParamBasedOnScrollDirection)}>
        <span className={clsx(styles.centered)}>T</span>
        <span className={clsx(styles.centered)}>U</span>
      </span>
    </div>
  </div>
}
