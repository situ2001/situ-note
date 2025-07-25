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
    <nav
      ref={headerRef}
      className={clsx(
        'px-4 md:px-8 py-2.5 mt-2.5 md:mb-4 transition-colors duration-300',
        isIntersecting
          ? ['bg-zinc-100', 'dark:bg-zinc-800']
          : ['dark:bg-zinc-900']
      )}
    >
      <div className="flex justify-between mx-auto max-w-screen-lg">
        <h2 className="left">
          <a href="/" className="font-serif">
            <SiteLogo />
          </a>
        </h2>

        <div className="right flex items-center gap-4">
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
      </div>
    </nav>
  );
};

const NavigationBarWithProps = () => <NavigationBar items={menuItem} />;
export default NavigationBarWithProps;
