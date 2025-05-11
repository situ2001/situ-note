import { useEffect, useRef, useState } from 'react';
import { throttle } from "es-toolkit";
import { isTwoElementsIntersecting } from "../utils/intersection";
import SiteLogo from "../components/SiteLogo";
import clsx from 'clsx';
import globalState from '../store';
import useEnvInfo from '../lib/useEnvInfo';

import type { NavigationItem } from 'types';
import config from 'config';
const menuItem = config.nav.items;

const NavigationBar = (
  { items }: { items: NavigationItem[] }
) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const headerRef = useRef<HTMLHeadElement>(null);

  const { isMobile, isTouch } = useEnvInfo();

  useEffect(() => {
    const onScroll = () => {
      const main = document.querySelector("main");
      const header = headerRef.current;
      if (!header || !main) return;

      setIsIntersecting(isTwoElementsIntersecting(header, main));
    };

    const throttledScroll = throttle(onScroll, 100);

    window.addEventListener("scroll", throttledScroll);

    onScroll();

    return () => window.removeEventListener("scroll", throttledScroll);
  }, []);

  return (
    <header
      ref={headerRef}
      className={clsx(
        'p-2 lg:mt-4 lg:mb-4 top-0 sticky transition-colors duration-300 z-10',
        isIntersecting
          ? ['bg-zinc-100', 'dark:bg-zinc-800']
          : ['dark:bg-zinc-900']
      )}
    >
      <nav className="flex justify-between text-xl mx-auto max-w-screen-lg">
        <h2 className="left">
          <a href="/" className="font-serif">
            <SiteLogo />
          </a>
        </h2>

        <div className="right flex items-center gap-4">
          {items.map((menu, index) => {
            const shouldMinimal = menu.forceMinimal || (menu.autoMinimal && isMobile);

            const onPointerEnter = () => {
              return menu.greeting
                && !(isMobile || isTouch)
                && globalState.heroSectionHint.state.set(menu.greeting)
            };

            const onPointerLeave = () => globalState.heroSectionHint.action.resetHint();

            if (menu.icon && shouldMinimal) {
              const Icon = menu.icon;
              return <a
                href={menu.link}
                title={menu.name}
                key={index}
                onPointerEnter={onPointerEnter}
                onPointerLeave={onPointerLeave}
              >
                <Icon />
              </a>
            }

            return <h2
              key={index}
              onPointerEnter={onPointerEnter}
              onPointerLeave={onPointerLeave}
            >
              <a href={menu.link} title={menu.name}>{menu.name}</a>
            </h2>
          })}
        </div>
      </nav>
    </header>
  );
};

const NavigationBarWithProps = () => <NavigationBar items={menuItem} />;
export default NavigationBarWithProps;
