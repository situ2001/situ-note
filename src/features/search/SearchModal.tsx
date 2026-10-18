import { useEffect, useRef, useState, useSyncExternalStore, type RefObject } from "react";
import { Search, Close, SearchLocate } from "@carbon/icons-react";
import clsx from "clsx";
import { Dialog } from "@base-ui/react/dialog";
import { loadPagefind, SearchSession } from "./searchSession";

interface SearchModalProps {
  onClose: () => void;
  triggerRef: RefObject<HTMLButtonElement | null>;
}

export default function SearchModal({ onClose, triggerRef }: SearchModalProps) {
  const [session] = useState(() => new SearchSession(loadPagefind));
  const { query, results, visibleCount, isLoading, initError } = useSyncExternalStore(
    session.subscribe,
    session.getSnapshot,
  );
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    void session.initialize();
    return () => session.dispose();
  }, [session]);

  const displayedResults = results.slice(0, visibleCount);
  const hasMore = results.length > visibleCount;
  const handleResultClick = () => onClose();

  return (
    <Dialog.Portal>
      <Dialog.Backdrop className="absolute inset-0 z-50 bg-backdrop backdrop-blur-sm" />
      <Dialog.Viewport className="fixed inset-0 z-50 flex items-start justify-center sm:pt-[15dvh]">
        <Dialog.Popup
          initialFocus={inputRef}
          finalFocus={triggerRef}
          className="flex h-dvh w-full min-h-0 flex-col overflow-hidden bg-panel text-content shadow-2xl sm:h-auto sm:max-h-[70dvh] sm:w-[32rem] sm:rounded-xl"
        >
          <Dialog.Title className="sr-only">Search articles</Dialog.Title>
          {/* Search input */}
          <div
            className={clsx(
              "flex items-center gap-3 px-4 py-3",
              "border-b border-border",
            )}
          >
            <Search size={20} className="text-muted shrink-0" />
            <input
              ref={inputRef}
              aria-label="Search articles"
              type="text"
              value={query}
              onChange={(event) => session.setQuery(event.target.value)}
              placeholder="Search articles..."
              className={clsx(
                "min-w-0 flex-1 bg-transparent",
                "text-content",
                "placeholder:text-muted",
                "text-base",
              )}
            />
            <Dialog.Close
              className={clsx(
                "p-1 rounded-md shrink-0",
                "hover:bg-surface",
                "transition-colors duration-feedback",
              )}
              aria-label="Close search"
            >
              <Close size={20} />
            </Dialog.Close>
          </div>

          {/* Results area */}
          <div className="min-h-0 flex-1 overflow-y-auto p-2">
            {initError && (
              <p role="alert" className="py-12 text-center text-sm text-secondary">
                Search is unavailable. Please try again later.
              </p>
            )}
            {/* Loading state */}
            {isLoading && (
              <div role="status" className="flex justify-center py-12">
                <span className="sr-only">Searching articles</span>
                <div
                  className={clsx(
                    "w-5 h-5 rounded-full border-2",
                    "border-border border-t-content",
                    "animate-spin",
                  )}
                />
              </div>
            )}

            {/* Empty state */}
            {!isLoading && !initError && query && results.length === 0 && (
              <div
                className={clsx(
                  "flex flex-col items-center justify-center",
                  "py-16 gap-4",
                  "text-muted",
                )}
              >
                <SearchLocate size={48} />
                <p className="text-sm">No results for "{query}"</p>
              </div>
            )}

            {/* Initial state (no query) */}
            {!isLoading && !initError && !query && (
              <div
                className={clsx(
                  "flex flex-col items-center justify-center",
                  "py-16 gap-3",
                  "text-muted",
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
                          "hover:bg-surface",
                          "transition-colors duration-feedback",
                        )}
                      >
                        <span className="text-sm font-medium text-content">
                          {result.title}
                        </span>
                        {result.excerpt && (
                          <span
                            className="text-xs text-muted line-clamp-2 [&_mark]:bg-highlight [&_mark]:text-content"
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
                        "bg-surface",
                        "hover:bg-surface-strong",
                        "text-secondary",
                        "transition-colors duration-feedback",
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
              "border-t border-border",
              "text-xs text-muted",
            )}
          >
            <span>
              <kbd
                className={clsx(
                  "px-1 py-0.5 rounded",
                  "bg-surface-strong",
                  "text-muted",
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
        </Dialog.Popup>
      </Dialog.Viewport>
    </Dialog.Portal>
  );
}
