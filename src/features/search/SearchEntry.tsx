import { lazy, Suspense, useEffect, useState } from "react";
import { Search } from "@carbon/icons-react";
import clsx from "clsx";

const SearchModal = lazy(() => import("./SearchModal"));

export default function SearchEntry() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        setIsOpen(true);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
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
      {isOpen && (
        <Suspense fallback={null}>
          <SearchModal onClose={() => setIsOpen(false)} />
        </Suspense>
      )}
    </>
  );
}
