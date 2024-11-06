import clsx from 'clsx';
import { AnimatePresence, motion, useCycle, type Variant } from 'framer-motion';
import { useRef, type CSSProperties } from 'react';
import style from './style.module.css';
import { useWindowDimensions } from '../../lib/useWindowDimensions';
import useScrollIdle from '../../lib/useScrollIdle';

export interface FloatingMenuProps {
  position?: "left-top" | "left-bottom" | "right-top" | "right-bottom";
}

const positionStyleObj: Record<NonNullable<FloatingMenuProps['position']>, CSSProperties> = {
  "left-top": {
    top: '18px',
    left: '15px',
  },
  "left-bottom": {
    bottom: '13px',
    left: '15px',
  },
  "right-top": {
    top: '18px',
    right: '15px',
  },
  "right-bottom": {
    bottom: '13px',
    right: '15px',
  },
};

const getCircleClipPaths: (height: number) => Record<NonNullable<FloatingMenuProps['position']>, {
  open: string,
  closed: string,
}> = (height = 1000) => {
  height = height * 2;

  return {
    "left-top": {
      open: `circle(${height}px at 40px 40px)`,
      closed: `circle(30px at 40px 40px)`,
    },
    "left-bottom": {
      open: `circle(${height}px at 40px calc(100% - 40px))`,
      closed: `circle(30px at 40px calc(100% - 40px))`,
    },
    "right-top": {
      open: `circle(${height}px at calc(100% - 40px) 40px)`,
      closed: `circle(30px at calc(100% - 40px) 40px)`,
    },
    "right-bottom": {
      open: `circle(${height}px at calc(100% - 40px) calc(100% - 40px))`,
      closed: `circle(30px at calc(100% - 40px) calc(100% - 40px))`,
    },
  }
}

const Path = (props: any) => (
  <motion.path
    fill="transparent"
    strokeWidth="3"
    stroke="hsl(0, 0%, 18%)"
    strokeLinecap="round"
    {...props}
  />
);

export default function FloatingMenu(props: FloatingMenuProps) {
  const { position = "left-top" } = props;

  const { width, height } = useWindowDimensions();
  const scrollIdle = useScrollIdle();
  const [isOpen, toggleOpen] = useCycle(false, true);

  return (
    <div>
      <AnimatePresence>
        {isOpen &&
          <motion.div
            className={clsx(style.menu,
              'fixed z-20',
              'w-screen h-screen',
              'md:w-1/2 md:h-1/2',
              { // TODO fix z-index
                'left-0 top-0': position === "left-top",
                'left-0 bottom-0': position === "left-bottom",
                'right-0 top-0': position === "right-top",
                'right-0 bottom-0': position === "right-bottom",
              }
            )}
            initial={false}
            animate={[
              isOpen ? "open" : "closed",
              isOpen || scrollIdle ? "scrollIdle" : "scrollActive"
            ]}
          >
            {/* Span-able Background */}
            <motion.div
              className={clsx(style.background)}
              style={{
                transformOrigin: "calc(100% - 40px) calc(100% - 40px)"
              }}
              initial={{
                clipPath: getCircleClipPaths(height)[position].closed,
                width: width,
                height: height,
              }}
              animate={{
                clipPath: getCircleClipPaths(height)[position].open,
                transition: {
                  type: "spring",
                  stiffness: 20,
                  restDelta: 2,
                },
              }}
              exit={{
                clipPath: getCircleClipPaths(height)[position].closed,
                transition: {
                  delay: 0.5,
                  type: "spring",
                  stiffness: 400,
                  damping: 40,
                },
              }}
            />

            {/* TODO put main menu container here */}
            {/* TODO detach from React tree when !isOpen */}
            <motion.div
              initial={{}}
              animate={{ transition: { staggerChildren: 0.07, delayChildren: 0.2 } }}
              exit={{ transition: { staggerChildren: 0.05, staggerDirection: -1 } }}
              // variants={{
              //   open: {
              //     transition: { staggerChildren: 0.07, delayChildren: 0.2 },
              //     display: 'block',
              //   },
              //   closed: {
              //     transition: { staggerChildren: 0.05, staggerDirection: -1 },
              //     display: 'none',
              //   },
              // }}
              className='absolute top-20'
            >
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1, transition: { y: { stiffness: 1000, velocity: -100 } } }}
                exit={{ y: 50, opacity: 0, transition: { y: { stiffness: 1000 } } }}

                // variants={{
                //   open: {
                //     y: 0,
                //     opacity: 1,
                //     transition: {
                //       y: { stiffness: 1000, velocity: -100 }
                //     }
                //   },
                //   closed: {
                //     y: 50,
                //     opacity: 0,
                //     transition: {
                //       y: { stiffness: 1000 }
                //     }
                //   }
                // }}

                style={{ border: '2px solid #FF008C' }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                Home
              </motion.div>
            </motion.div>
          </motion.div>
        }
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.div
        className={clsx(style.background, 'fixed', 'z-40')}
        style={{
          // transformOrigin: "calc(100% - 40px) calc(100% - 40px)",
          clipPath: getCircleClipPaths(height)[position].closed,
          ...positionStyleObj[position],

          // TODO refactor this
          bottom: '0',
          right: '0',
        }}
        variants={{
          scrollIdle: { scale: 1 },
          scrollActive: { scale: 0 }
        }}
        animate={[
          isOpen ? "open" : "closed",
          isOpen || scrollIdle ? "scrollIdle" : "scrollActive"
        ]}
      >
        <motion.button
          onClick={() => toggleOpen()}
          className={clsx(style.button)}
          style={{
            ...positionStyleObj[position],
          }}
        >
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
        </motion.button>
      </motion.div>
    </div>
  )
}
