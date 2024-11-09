import clsx from "clsx";
import styles from "./styles.module.css";
import type { Link } from "./types";

type MenuProps = {
  links: Link[];
};

export default function MenuContent({ links }: MenuProps) {
  return (
    <nav className={clsx(styles['menu'], 'bg-slate-100 dark:bg-slate-700')}>
      <div className={styles['menu-wrapper']}>
        <ul>
          {links.map((link, index) => (
            <li key={index}>
              <a href={link.link}>{link.content}</a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
