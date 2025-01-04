import { useEffect, useRef, useState } from 'react';
import { throttle } from "es-toolkit";
import { isTwoElementsIntersecting } from "../utils/intersection";
import SiteLogo from "../components/SiteLogo";
import clsx from 'clsx';
import "../styles/header.css";
import globalState from '../store';
import useEnvInfo from '../lib/useEnvInfo';

type TopRightMenu = {
  name: string;
  url: string;
  /**
   * Optional hint for the menu item.
   */
  hint?: string;
};

const topRightMenu: TopRightMenu[] = [
  { name: "Blog", url: "/blog", hint: "Check my thoughts and ideas." },
  { name: "Friends", url: "/friends", hint: "You can visit my friends." },
  { name: "RSS", url: "/rss.xml", hint: "Why not subscribe to my RSS feed?" },
];

const NavigationBar = () => {
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
        'p-4 lg:mt-4 lg:mb-4 top-0 sticky transition-colors duration-300 z-10',
        isIntersecting
          ? ['bg-slate-100', 'dark:bg-slate-700']
          : ['bg-white', 'dark:bg-slate-800']
      )}
    >
      <nav className="text-xl mx-auto max-w-screen-lg">
        <h2 className="left">
          <a href="/" className="font-serif">
            <SiteLogo />
          </a>
        </h2>

        <div className="right flex items-center gap-4">
          {topRightMenu.map((menu, index) => (
            <h2
              key={index}
              onPointerEnter={
                () => menu.hint
                  && !(isMobile || isTouch)
                  && globalState.heroSectionHint.state.set(menu.hint)
              }
              onPointerLeave={
                () => globalState.heroSectionHint.action.resetHint()
              }
            >
              <a href={menu.url} title={menu.name}>{menu.name}</a>
            </h2>
          ))}
        </div>
      </nav>
    </header>
  );
};

export default NavigationBar;
