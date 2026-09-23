import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Search, Close, SearchLocate } from "@carbon/icons-react";
import clsx from "clsx";
import { loadPagefind, SearchSession } from "./searchSession";

interface SearchModalProps {
  onClose: () => void;
}

export default function SearchModal({ onClose }: SearchModalProps) {
  const [session] = useState(() => new SearchSession(loadPagefind));
  const { query, results, visibleCount, isLoading } = useSyncExternalStore(
    session.subscribe,
    session.getSnapshot,
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    void session.initialize();
    return () => session.dispose();
  }, [session]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => inputRef.current?.focus());
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const displayedResults = results.slice(0, visibleCount);
  const hasMore = results.length > visibleCount;
  const handleResultClick = () => onClose();

  return (
    <div
      ref={modalRef}
      className={clsx(
        "fixed inset-0 z-50",
        "flex items-start justify-center",
        "pt-[15vh]",
        "bg-zinc-900/50 dark:bg-black/60",
        "backdrop-blur-sm",
      )}
      onClick={(e) => {
        if (e.target === modalRef.current) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Search articles"
    >
      <div
        className={clsx(
          "w-full sm:w-[32rem] sm:max-h-[70vh] sm:rounded-xl",
          "max-sm:h-full max-sm:max-h-full max-sm:rounded-none",
          "bg-white dark:bg-zinc-800",
          "shadow-2xl",
          "flex flex-col",
          "overflow-hidden",
        )}
      >
        {/* Search input */}
        <div
          className={clsx(
            "flex items-center gap-3 px-4 py-3",
            "border-b border-zinc-200 dark:border-zinc-700",
          )}
        >
          <Search size={20} className="text-zinc-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(event) => session.setQuery(event.target.value)}
            placeholder="Search articles..."
            className={clsx(
              "flex-1 bg-transparent outline-none",
              "text-zinc-800 dark:text-zinc-200",
              "placeholder:text-zinc-400",
              "text-base",
            )}
          />
          <button
            onClick={onClose}
            className={clsx(
              "p-1 rounded-md shrink-0",
              "hover:bg-zinc-100 dark:hover:bg-zinc-700",
              "transition-colors",
            )}
            aria-label="Close search"
          >
            <Close size={20} />
          </button>
        </div>

        {/* Results area */}
        <div className="flex-1 overflow-y-auto p-2">
          {/* Loading state */}
          {isLoading && (
            <div className="flex justify-center py-12">
              <div
                className={clsx(
                  "w-5 h-5 rounded-full border-2",
                  "border-zinc-300 border-t-zinc-600",
                  "dark:border-zinc-600 dark:border-t-zinc-300",
                  "animate-spin",
                )}
              />
            </div>
          )}

          {/* Empty state */}
          {!isLoading && query && results.length === 0 && (
            <div
              className={clsx(
                "flex flex-col items-center justify-center",
                "py-16 gap-4",
                "text-zinc-400 dark:text-zinc-500",
              )}
            >
              <SearchLocate size={48} />
              <p className="text-sm">No results for "{query}"</p>
            </div>
          )}

          {/* Initial state (no query) */}
          {!isLoading && !query && (
            <div
              className={clsx(
                "flex flex-col items-center justify-center",
                "py-16 gap-3",
                "text-zinc-300 dark:text-zinc-600",
              )}
            >
              <Search size={40} />
              <p className="text-sm">Type to search articles</p>
            </div>
          )}

          {/* Results */}
          {!isLoading && results.length > 0 && (
            <>
              <ul className="space-y-0.5">
                {displayedResults.map((result) => (
                  <li key={result.url}>
                    <a
                      href={result.url}
                      onClick={handleResultClick}
                      className={clsx(
                        "flex flex-col gap-1",
                        "px-3 py-2.5 rounded-lg",
                        "hover:bg-zinc-100 dark:hover:bg-zinc-700",
                        "transition-colors",
                      )}
                    >
                      <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                        {result.title}
                      </span>
                      {result.excerpt && (
                        <span
                          className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2"
                          dangerouslySetInnerHTML={{ __html: result.excerpt }}
                        />
                      )}
                    </a>
                  </li>
                ))}
              </ul>
              {hasMore && (
                <div className="flex justify-center py-3">
                  <button
                    onClick={() => session.loadMore()}
                    className={clsx(
                      "px-4 py-1.5 rounded-md text-sm",
                      "bg-zinc-100 dark:bg-zinc-700",
                      "hover:bg-zinc-200 dark:hover:bg-zinc-600",
                      "text-zinc-600 dark:text-zinc-300",
                      "transition-colors",
                    )}
                  >
                    Load more ({results.length - visibleCount} remaining)
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div
          className={clsx(
            "flex items-center justify-between",
            "px-4 py-2",
            "border-t border-zinc-200 dark:border-zinc-700",
            "text-xs text-zinc-400 dark:text-zinc-500",
          )}
        >
          <span>
            <kbd
              className={clsx(
                "px-1 py-0.5 rounded",
                "bg-zinc-100 dark:bg-zinc-700",
                "text-zinc-500 dark:text-zinc-400",
                "font-mono text-[11px]",
              )}
            >
              Esc
            </kbd>{" "}
            to close
          </span>
          {query && !isLoading && (
            <span>
              Showing {displayedResults.length} of {results.length} results
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
