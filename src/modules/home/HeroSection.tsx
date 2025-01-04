import { motion, AnimatePresence } from "framer-motion";
import LinkButton from "../../components/IconLink";

import { useStore } from '@nanostores/react';
import globalState from "../../store";
import { useMemo } from "react";
import useEnvInfo from "../../lib/useEnvInfo";

import config from "config";
const { contacts: links } = config.hero;

export default function AboutMe() {
  const $heroSectionHint = useStore(globalState.heroSectionHint.state);


  const { isMobile, isTouch } = useEnvInfo();

  const motionPropsForHeroSectionHint = useMemo(() => {
    return isMobile || isTouch
      ? {}
      : {
        initial: { y: 5, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        exit: { y: -5, opacity: 0 },
        transition: { duration: 0.2 },
      }
  }, [isMobile]);

  return (
    <section className="flex flex-col h-full gap-2">
      <div>
        <h1 className="text-3xl font-bold mb-2">Hi.</h1>
        <motion.div
          className="text-2xl font-bold mb-2 h-8" // added fixed height
        >
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={$heroSectionHint}
              {...motionPropsForHeroSectionHint}
            >
              {$heroSectionHint}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>


      <div>
        <p>A software developer.</p>
      </div>

      <div className="mb-1"></div>

      <Contact
        onHoverChange={(name) => {
          if (isMobile || isTouch) return;

          if (name) {
            globalState.heroSectionHint.state.set(`Find me on ${name}.`);
          } else {
            globalState.heroSectionHint.action.resetHint();
          }
        }}
      />
    </section>
  );
}

function Contact(props: {
  onHoverChange?: (name: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-4 flex-row">
        {links.map((link) => (
          <div
            key={link.name}
            onPointerEnter={() => props.onHoverChange?.(link.name)}
            onPointerLeave={() => props.onHoverChange?.("")}
          >
            <LinkButton
              icon={link.icon}
              link={link.link}
              name={link.name}
              hideText
              size="lg"
            />
          </div>
        ))}
      </div>
    </div>
  )
}