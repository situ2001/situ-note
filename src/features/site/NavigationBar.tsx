import { useEffect, useRef, useState } from "react";
import { throttle } from "es-toolkit";
import { isTwoElementsIntersecting } from "./intersection";
import SiteLogo from "./SiteLogo";
import SearchEntry from "@/features/search/SearchEntry";
import clsx from "clsx";
import type { NavigationItem } from "types";
import config from "config";

const menuItem = config.nav.items;

const NavigationBar = ({ items }: { items: NavigationItem[] }) => {
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
    <>
      <nav
        ref={headerRef}
        className={clsx(
          "px-4 md:px-8 py-2.5 mt-2.5 md:mb-4 transition-colors duration-300",
          isIntersecting
            ? ["bg-zinc-100", "dark:bg-zinc-800"]
            : ["dark:bg-zinc-900"],
        )}
      >
        <div className="flex justify-between mx-auto max-w-screen-lg">
          <h2 className="left">
            <a href="/" aria-label="Home" className="min-w-11 min-h-11 flex items-center">
              <SiteLogo />
            </a>
          </h2>

          <div className="right flex items-center gap-0 sm:gap-2 md:gap-4 text-sm sm:text-base">
            {items.map((menu) => {
              const Icon = menu.icon;
              return (
                <a
                  key={menu.link}
                  href={menu.link}
                  title={menu.name}
                  aria-label={menu.name}
                  className="min-w-11 min-h-11 px-1 flex items-center justify-center shrink-0 rounded-md"
                >
                  <span className={clsx(menu.forceMinimal && Icon ? "hidden" : menu.autoMinimal && Icon ? "hidden md:block" : "block")}>
                    {menu.name}
                  </span>
                  {Icon && (
                    <span className={clsx(menu.forceMinimal ? "block" : menu.autoMinimal ? "block md:hidden" : "hidden")}>
                      <Icon size={16} />
                    </span>
                  )}
                </a>
              );
            })}

            <SearchEntry />
          </div>
        </div>
      </nav>

    </>
  );
};

const NavigationBarWithProps = () => <NavigationBar items={menuItem} />;
export default NavigationBarWithProps;
