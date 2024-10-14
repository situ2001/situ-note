import { useEffect, useState } from 'react';
import styles from './style.module.css';
import clsx from 'clsx';

// TODO Pick a better font
export default function BrandIcon() {
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up');

  useEffect(() => {
    let lastScrollTop = 0;
    const handleScroll = () => {
      // FIXME copilot generated this code, it may not working as expected
      const st = window.pageYOffset || document.documentElement.scrollTop;
      if (st > lastScrollTop) {
        setScrollDirection('down');
      } else {
        setScrollDirection('up');
      }
      lastScrollTop = st <= 0 ? 0 : st;
    }

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const clsxParamBasedOnScrollDirection = {
    [styles['transform-year-to-name']]: scrollDirection === 'up',
    [styles['transform-name-to-year']]: scrollDirection === 'down',
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
