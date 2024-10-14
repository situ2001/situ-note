import styles from './style.module.css';
import clsx from 'clsx';

// TODO Pick a better font
export default function BrandIcon() {
  return <div className={
    clsx('relative', styles.container)
  }>
    <div className={clsx(styles['container-year'])}>
      <span className={clsx(styles['year-20'])}>
        <span className={clsx(styles.centered)}>2</span>
        <span className={clsx(styles.centered)}>0</span>
      </span>
      <span className={clsx(styles['year-01'])}>
        <span className={clsx(styles.centered)}>0</span>
        <span className={clsx(styles.centered)}>1</span>
      </span>
    </div>
    <div>
      <span className={clsx(styles.si)}>
        <span className={clsx(styles.centered)}>S</span>
        <span className={clsx(styles.centered)}>I</span>
      </span>
      <span className={clsx(styles.tu)}>
        <span className={clsx(styles.centered)}>T</span>
        <span className={clsx(styles.centered)}>U</span>
      </span>
    </div>
  </div>
}
