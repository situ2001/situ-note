import { createSignal, onCleanup, onMount } from "solid-js";

export default function useScrollIdle(idleDelay = 200, scrollThreshold = 100) {
  const [isIdle, setIsIdle] = createSignal(true);
  let idleTimeout: ReturnType<typeof setTimeout> | undefined;
  let lastScrollY = 0;

  onMount(() => {
    lastScrollY = window.scrollY;
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (Math.abs(scrollY - lastScrollY) <= scrollThreshold) return;

      setIsIdle(false);
      lastScrollY = scrollY;
      clearTimeout(idleTimeout);
      idleTimeout = setTimeout(() => setIsIdle(true), idleDelay);
    };
    window.addEventListener("scroll", handleScroll);
    onCleanup(() => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(idleTimeout);
    });
  });

  return isIdle;
}
