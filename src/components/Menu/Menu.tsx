import clsx from "clsx";
import styles from "./styles.module.css";

export function Menu() {
  return (
    <nav className={clsx(styles['menu'], 'bg-slate-100 dark:bg-slate-700')}>
      <ul>
        <li>Portfolio</li>
        <li>About</li>
        <li>Contact</li>
        <li>Search</li>
      </ul>
    </nav>
  );
}
