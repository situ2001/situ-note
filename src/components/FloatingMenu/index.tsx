import clsx from 'clsx';
import { motion, useCycle } from 'framer-motion';
import { useRef } from 'react';
import style from './style.module.css';

const sidebar = {
  open: (height = 1000) => ({
    clipPath: `circle(${height * 2 + 200}px at 40px 40px)`,
    transition: {
      type: "spring",
      stiffness: 20,
      restDelta: 2,
    },
  }),
  closed: {
    clipPath: "circle(30px at 40px 40px)",
    transition: {
      delay: 0.5,
      type: "spring",
      stiffness: 400,
      damping: 40,
    },
  },
};

const Path = (props: any) => (
  <motion.path
    fill="transparent"
    strokeWidth="3"
    stroke="hsl(0, 0%, 18%)"
    strokeLinecap="round"
    {...props}
  />
);

const menuVariants = {
  open: {
    transition: { staggerChildren: 0.07, delayChildren: 0.2 }
  },
  closed: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 }
  }
};

const itemVariants = {
  open: {
    y: 0,
    opacity: 1,
    transition: {
      y: { stiffness: 1000, velocity: -100 }
    }
  },
  closed: {
    y: 50,
    opacity: 0,
    transition: {
      y: { stiffness: 1000 }
    }
  }
};

export default function FloatingMenu() {
  const [isOpen, toggleOpen] = useCycle(false, true);

  // TODO where should I pass this ref?
  const containerRef = useRef(null);

  return (
    <motion.div
      className={clsx(style.menu)}
      initial={false}
      animate={isOpen ? "open" : "closed"}
      custom={800}
    >
      <motion.div className={clsx(style.background)} variants={sidebar}></motion.div>

      {/* TODO put main menu container here */}
      <motion.div variants={menuVariants} className='absolute top-20'>
        <motion.div
          variants={itemVariants}
          style={{ border: '2px solid #FF008C' }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          Home
        </motion.div>
      </motion.div>

      {/* Toggle Button */}
      <button onClick={() => toggleOpen()} className={clsx(style.button)}>
        <svg width="23" height="23" viewBox="0 0 23 23" className="mx-auto">
          <Path
            variants={{
              closed: { d: "M 2 2.5 L 20 2.5" },
              open: { d: "M 3 16.5 L 17 2.5" }
            }}
          />
          <Path
            d="M 2 9.423 L 20 9.423"
            variants={{
              closed: { opacity: 1 },
              open: { opacity: 0 }
            }}
            transition={{ duration: 0.1 }}
          />
          <Path
            variants={{
              closed: { d: "M 2 16.346 L 20 16.346" },
              open: { d: "M 3 2.5 L 17 16.346" }
            }}
          />
        </svg>
      </button>
    </motion.div>
  )
}
