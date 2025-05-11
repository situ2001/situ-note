import { useEffect, useRef, useState } from 'react';
import { throttle } from "es-toolkit";
import { isTwoElementsIntersecting } from "../utils/intersection";
import SiteLogo from "../components/SiteLogo";
import clsx from 'clsx';
import type { NavigationItem } from 'types';
import config from 'config';
import React from 'react';

const menuItem = config.nav.items;

const NavigationBar = (
  { items }: { items: NavigationItem[] }
) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const headerRef = useRef<HTMLHeadElement>(null);

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
        'p-2.5 lg:mt-4 lg:mb-4 top-0 sticky transition-colors duration-300 z-10',
        isIntersecting
          ? ['bg-zinc-100', 'dark:bg-zinc-800']
          : ['dark:bg-zinc-900']
      )}
    >
      <nav className="flex justify-between mx-auto max-w-screen-lg">
        <h2 className="left">
          <a href="/" className="font-serif">
            <SiteLogo />
          </a>
        </h2>

        <div className="right flex items-center gap-3">
          {items.map((menu, index) => {
            const forceMinimal = menu.forceMinimal;
            const autoMinimal = menu.autoMinimal;

            const classNameForText = (() => {
              if (forceMinimal) return clsx('hidden');
              if (autoMinimal) return clsx('hidden md:block');

              return clsx('block');
            })();

            const classNameForIcon = (() => {
              if (forceMinimal) return clsx('block');
              if (autoMinimal) return clsx('block md:hidden');

              return clsx('hidden');
            })();

            const Icon = menu.icon;

            return <React.Fragment key={index}>
              <h2
                className={classNameForText}
              >
                <a href={menu.link} title={menu.name}>{menu.name}</a>
              </h2>
              {
                Icon &&
                <a
                  className={classNameForIcon}
                  href={menu.link}
                  title={menu.name}
                >
                  <Icon size={16} />
                </a>
              }
            </React.Fragment>
          })}
        </div>
      </nav>
    </header>
  );
};

const NavigationBarWithProps = () => <NavigationBar items={menuItem} />;
export default NavigationBarWithProps;
