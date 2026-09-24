import styles from './SiteLogo.module.css';
import clsx from 'clsx';
import useScrollIdle from './useScrollIdle';

// TODO Pick a better font
export default function BrandIcon() {
  const isScrollIdle = useScrollIdle(1000);

  const clsxParamBasedOnScrollDirection = () => ({
    [styles['transform-year-to-name']]: isScrollIdle(),
    [styles['transform-name-to-year']]: !isScrollIdle()
  });

  return <div class={
    clsx('relative', styles.container)
  }>
    <div class={clsx(styles['container-year'])}>
      <span class={clsx(styles['year-20'], clsxParamBasedOnScrollDirection())}>
        <span class={clsx(styles.centered)}>2</span>
        <span class={clsx(styles.centered)}>0</span>
      </span>
      <span class={clsx(styles['year-01'], clsxParamBasedOnScrollDirection())}>
        <span class={clsx(styles.centered)}>0</span>
        <span class={clsx(styles.centered)}>1</span>
      </span>
    </div>
    <div>
      <span class={clsx(styles.si, clsxParamBasedOnScrollDirection())}>
        <span class={clsx(styles.centered)}>S</span>
        <span class={clsx(styles.centered)}>I</span>
      </span>
      <span class={clsx(styles.tu, clsxParamBasedOnScrollDirection())}>
        <span class={clsx(styles.centered)}>T</span>
        <span class={clsx(styles.centered)}>U</span>
      </span>
    </div>
  </div>
}
