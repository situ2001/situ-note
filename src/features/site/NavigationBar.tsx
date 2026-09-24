import { createSignal, onCleanup, onMount } from "solid-js";
import { throttle } from "es-toolkit";
import { isTwoElementsIntersecting } from "./intersection";
import SiteLogo from "./SiteLogo";
import SearchEntry from "@/features/search/SearchEntry";
import SvgIcon from "./SvgIcon";
import clsx from "clsx";
import type { NavigationItem } from "types";

export default function NavigationBar(props: { items: NavigationItem[] }) {
  const [isIntersecting, setIsIntersecting] = createSignal(false);
  let headerRef: HTMLElement | undefined;

  onMount(() => {
    const onScroll = () => {
      const main = document.querySelector("main");
      if (!headerRef || !main) return;
      setIsIntersecting(isTwoElementsIntersecting(headerRef, main));
    };
    const throttledScroll = throttle(onScroll, 100);
    window.addEventListener("scroll", throttledScroll);
    onScroll();
    onCleanup(() => window.removeEventListener("scroll", throttledScroll));
  });

  return (
    <nav
      ref={headerRef}
      class={clsx(
        "px-4 md:px-8 py-2.5 mt-2.5 md:mb-4 transition-colors duration-300",
        isIntersecting() ? ["bg-zinc-100", "dark:bg-zinc-800"] : ["dark:bg-zinc-900"],
      )}
    >
      <div class="flex justify-between mx-auto max-w-screen-lg">
        <h2 class="left">
          <a href="/" class="font-serif min-w-11 min-h-11 flex items-center">
            <SiteLogo />
          </a>
        </h2>
        <div class="right flex items-center gap-0 sm:gap-2 md:gap-4 text-sm sm:text-base">
          {props.items.map((menu) => (
            <a
              href={menu.link}
              title={menu.name}
              aria-label={menu.name}
              class="min-w-11 min-h-11 px-1 flex items-center justify-center shrink-0 rounded-md"
            >
              <span class={clsx(menu.forceMinimal && menu.icon ? "hidden" : menu.autoMinimal && menu.icon ? "hidden md:block" : "block")}>
                {menu.name}
              </span>
              {menu.icon && (
                <span class={clsx(menu.forceMinimal ? "block" : menu.autoMinimal ? "block md:hidden" : "hidden")}>
                  <SvgIcon markup={menu.icon} class="size-4" />
                </span>
              )}
            </a>
          ))}
          <SearchEntry />
        </div>
      </div>
    </nav>
  );
}
