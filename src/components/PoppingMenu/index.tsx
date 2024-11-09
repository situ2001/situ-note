import styles from "./index.module.css";
import { useState, useEffect } from "react";
import { useAnimate, stagger, motion } from "framer-motion";
import clsx from "clsx";
import { FaBars } from "react-icons/fa6";

const staggerMenuItems = stagger(0.1, { startDelay: 0.15 });

function useMenuAnimation(isOpen: boolean) {
  const [scope, animate] = useAnimate();

  useEffect(() => {
    animate(`.${styles.arrow}`, { rotate: isOpen ? 180 : 0 }, { duration: 0.2 });

    animate(
      `.${styles.menuList}`,
      {
        clipPath: isOpen
          ? "inset(0% 0% 0% 0% round 10px)"
          : "inset(10% 50% 90% 50% round 10px)",
      },
      {
        type: "spring",
        bounce: 0,
        duration: 0.5,
      }
    );

    animate(
      `.${styles.menuItem}`,
      isOpen
        ? { opacity: 1, scale: 1, filter: "blur(0px)" }
        : { opacity: 0, scale: 0.3, filter: "blur(20px)" },
      {
        duration: 0.2,
        delay: isOpen ? staggerMenuItems : 0,
      }
    );
  }, [isOpen]);

  return scope;
}

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const scope = useMenuAnimation(isOpen);

  return (
    <nav className={styles.menu} ref={scope}>
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={() => setIsOpen(!isOpen)}
        className={styles.menuButton}
      >
        <FaBars size={24} />
        <div className={styles.arrow}>
          <svg width="15" height="15" viewBox="0 0 20 20">
            <path d="M0 7 L 20 7 L 10 16" />
          </svg>
        </div>
      </motion.button>
      <ul
        className={clsx(styles.menuList, { [styles.open]: isOpen })}
      >
        <li className={styles.menuItem}>Item 1</li>
        <li className={styles.menuItem}>Item 2</li>
        <li className={styles.menuItem}>Item 3</li>
        <li className={styles.menuItem}>Item 4</li>
        <li className={styles.menuItem}>Item 5</li>
      </ul>
    </nav>
  );
}
