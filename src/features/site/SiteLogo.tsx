import styles from './SiteLogo.module.css';
import clsx from 'clsx';
import useScrollIdle from './useScrollIdle';
import { logoGlyphPaths } from './logo-glyphs';

function Glyph({ char }: { char: keyof typeof logoGlyphPaths }) {
  return (
    <svg className={styles.glyph} viewBox="0 0 16 16" aria-hidden="true">
      <path d={logoGlyphPaths[char]} />
    </svg>
  );
}

export default function BrandIcon() {
  const isScrollIdle = useScrollIdle(1000);

  const clsxParamBasedOnScrollDirection = {
    [styles['transform-year-to-name']]: isScrollIdle,
    [styles['transform-name-to-year']]: !isScrollIdle
  }

  return <div className={
    clsx('relative', styles.container)
  } aria-hidden="true">
    <div className={clsx(styles['container-year'])}>
      <span className={clsx(styles['year-20'], clsxParamBasedOnScrollDirection)}>
        <Glyph char="2" />
        <Glyph char="0" />
      </span>
      <span className={clsx(styles['year-01'], clsxParamBasedOnScrollDirection)}>
        <Glyph char="0" />
        <Glyph char="1" />
      </span>
    </div>
    <div>
      <span className={clsx(styles.si, clsxParamBasedOnScrollDirection)}>
        <Glyph char="S" />
        <Glyph char="I" />
      </span>
      <span className={clsx(styles.tu, clsxParamBasedOnScrollDirection)}>
        <Glyph char="T" />
        <Glyph char="U" />
      </span>
    </div>
  </div>
}
