import { createSignal, lazy, onCleanup, onMount, Suspense } from "solid-js";
import searchIcon from "@carbon/icons/svg/16/search.svg?raw";
import clsx from "clsx";
import SvgIcon from "@/features/site/SvgIcon";

const SearchModal = lazy(() => import("./SearchModal"));

export default function SearchEntry() {
  const [isOpen, setIsOpen] = createSignal(false);

  onMount(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        setIsOpen(true);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    onCleanup(() => document.removeEventListener("keydown", handleKeyDown));
  });

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        class={clsx(
          "min-w-11 min-h-11 flex items-center justify-center shrink-0 rounded-md cursor-pointer",
          "hover:bg-zinc-200 dark:hover:bg-zinc-700",
        )}
        aria-label="Search"
        title="Search (⌘K)"
      >
        <SvgIcon markup={searchIcon} class="size-[18px]" />
      </button>
      {isOpen() && (
        <Suspense fallback={null}>
          <SearchModal onClose={() => setIsOpen(false)} />
        </Suspense>
      )}
    </>
  );
}
