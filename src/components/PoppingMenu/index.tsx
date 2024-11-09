import styles from "./index.module.css";
import { useState, useEffect, type PropsWithChildren } from "react";
import { useAnimate, stagger, motion } from "framer-motion";
import clsx from "clsx";
import { FaBars } from "react-icons/fa6";

const staggerMenuItems = stagger(0.1, { startDelay: 0.15 });

export interface PoppingMenuProps {
}

export default function App(props: PropsWithChildren<PoppingMenuProps>) {
  const { children } = props;

  const [isOpen, setIsOpen] = useState(false);
  const [scope, animate] = useAnimate();

  useEffect(() => {
    // animate(`.${styles.arrow}`, { rotate: isOpen ? 180 : 0 }, { duration: 0.2 });

    animate(
      `.${styles.menuList}`,
      {
        clipPath: isOpen
          ? "inset(0% 0% 0% 0% round 10px)"
          : "inset(20% 50% 80% 50% round 10px)",
      },
      {
        type: "spring",
        bounce: 0,
        duration: 0.5,
      }
    );

    // if (children) {
    //   animate(
    //     `ul > *:not(astro-slot), ul > astro-slot > *`,
    //     isOpen
    //       ? { opacity: 1, scale: 1, filter: "blur(0px)" }
    //       : { opacity: 0, scale: 0.3, filter: "blur(20px)" },
    //     {
    //       duration: 0.2,
    //       delay: isOpen ? staggerMenuItems : 0,
    //     }
    //   );
    // }
  }, [isOpen, children]);


  // click other area to close
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (scope.current
        && !scope.current.contains(e.target as Node)
        && isOpen) {
        setIsOpen(false);
        e.preventDefault();
        e.stopPropagation();
      }
    }

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [isOpen]);

  return (
    <nav className={styles.menu} ref={scope}>
      <motion.button
        whileTap={{ scale: 0.8 }}
        onClick={() => setIsOpen(!isOpen)}
        className={styles.menuButton}
      >
        <FaBars />

        {/* <div className={styles.arrow}>
          <svg width="15" height="15" viewBox="0 0 20 20">
            <path d="M0 7 L 20 7 L 10 16" />
          </svg>
        </div> */}
      </motion.button>

      <ul
        className={clsx(styles.menuList,
          { [styles.open]: isOpen },
        )}
      >
        {props.children}
      </ul>
    </nav>
  );
}
