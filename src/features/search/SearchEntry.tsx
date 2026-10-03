import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Search } from "@carbon/icons-react";
import clsx from "clsx";
import { Dialog } from "@base-ui/react/dialog";

const SearchModal = lazy(() => import("./SearchModal"));

export default function SearchEntry() {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

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
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger
        ref={triggerRef}
        className={clsx(
          "min-w-11 min-h-11 flex items-center justify-center shrink-0 rounded-md cursor-pointer",
          "hover:bg-surface-strong",
          "transition-colors duration-feedback",
        )}
        aria-label="Search"
        title="Search (⌘K)"
      >
        <Search size={18} />
      </Dialog.Trigger>
      {isOpen && (
        <Suspense fallback={null}>
          <SearchModal onClose={() => setIsOpen(false)} triggerRef={triggerRef} />
        </Suspense>
      )}
    </Dialog.Root>
  );
}
