import { useEffect, useRef, useState, Suspense, lazy } from "react";
import { throttle } from "es-toolkit";
import { isTwoElementsIntersecting } from "../utils/intersection";
import SiteLogo from "../components/SiteLogo";
import { Search } from "@carbon/icons-react";
import clsx from "clsx";
import type { NavigationItem } from "types";
import config from "config";

const SearchModal = lazy(() => import("../components/SearchModal"));

const menuItem = config.nav.items;

const NavigationBar = ({ items }: { items: NavigationItem[] }) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const headerRef = useRef<HTMLHeadElement>(null);

  const openSearch = () => setIsSearchOpen(true);
  const closeSearch = () => setIsSearchOpen(false);

  // Global keyboard shortcut: Cmd/Ctrl + K to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

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
            <a href="/" className="font-serif min-w-11 min-h-11 flex items-center">
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

            {/* Search button */}
            <button
              onClick={openSearch}
              className={clsx(
                "min-w-11 min-h-11 flex items-center justify-center shrink-0 rounded-md cursor-pointer",
                "hover:bg-zinc-200 dark:hover:bg-zinc-700",
                "transition-colors",
              )}
              aria-label="Search"
              title="Search (⌘K)"
            >
              <Search size={18} />
            </button>
          </div>
        </div>
      </nav>

      {isSearchOpen && (
        <Suspense fallback={null}>
          <SearchModal onClose={closeSearch} />
        </Suspense>
      )}
    </>
  );
};

const NavigationBarWithProps = () => <NavigationBar items={menuItem} />;
export default NavigationBarWithProps;
