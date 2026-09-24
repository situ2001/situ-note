import { createMemo, createSignal, For, onCleanup, onMount } from "solid-js";
import searchIcon from "@carbon/icons/svg/16/search.svg?raw";
import closeIcon from "@carbon/icons/svg/32/close.svg?raw";
import searchLocateIcon from "@carbon/icons/svg/32/search--locate.svg?raw";
import clsx from "clsx";
import SvgIcon from "@/features/site/SvgIcon";
import { loadPagefind, SearchSession } from "./searchSession";

interface SearchModalProps {
  onClose: () => void;
}

export default function SearchModal(props: SearchModalProps) {
  const session = new SearchSession(loadPagefind);
  const [snapshot, setSnapshot] = createSignal(session.getSnapshot());
  const displayedResults = createMemo(() => snapshot().results.slice(0, snapshot().visibleCount));
  const hasMore = createMemo(() => snapshot().results.length > snapshot().visibleCount);
  let inputRef: HTMLInputElement | undefined;
  let modalRef: HTMLDivElement | undefined;

  onMount(() => {
    const unsubscribe = session.subscribe(() => setSnapshot(session.getSnapshot()));
    void session.initialize();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusFrame = requestAnimationFrame(() => inputRef?.focus());
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") props.onClose();
    };
    document.addEventListener("keydown", handleKeyDown);

    onCleanup(() => {
      unsubscribe();
      session.dispose();
      document.body.style.overflow = previousOverflow;
      cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", handleKeyDown);
    });
  });

  return (
    <div
      ref={modalRef}
      class={clsx(
        "fixed inset-0 z-50",
        "flex items-start justify-center",
        "pt-[15vh]",
        "bg-zinc-900/50 dark:bg-black/60",
        "backdrop-blur-sm",
      )}
      onClick={(event) => {
        if (event.target === modalRef) props.onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Search articles"
    >
      <div
        class={clsx(
          "w-full sm:w-[32rem] sm:max-h-[70vh] sm:rounded-xl",
          "max-sm:h-full max-sm:max-h-full max-sm:rounded-none",
          "bg-white dark:bg-zinc-800",
          "shadow-2xl",
          "flex flex-col",
          "overflow-hidden",
        )}
      >
        <div class="flex items-center gap-3 px-4 py-3 border-b border-zinc-200 dark:border-zinc-700">
          <SvgIcon markup={searchIcon} class="size-5 text-zinc-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={snapshot().query}
            onInput={(event) => session.setQuery(event.currentTarget.value)}
            placeholder="Search articles..."
            class={clsx(
              "flex-1 bg-transparent outline-none",
              "text-zinc-800 dark:text-zinc-200",
              "placeholder:text-zinc-400",
              "text-base",
            )}
          />
          <button
            onClick={props.onClose}
            class="p-1 rounded-md shrink-0 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
            aria-label="Close search"
          >
            <SvgIcon markup={closeIcon} class="size-5" />
          </button>
        </div>

        <div class="flex-1 overflow-y-auto p-2">
          {snapshot().isLoading && (
            <div class="flex justify-center py-12">
              <div class="size-5 rounded-full border-2 border-zinc-300 border-t-zinc-600 dark:border-zinc-600 dark:border-t-zinc-300 animate-spin" />
            </div>
          )}

          {!snapshot().isLoading && snapshot().query && snapshot().results.length === 0 && (
            <div class="flex flex-col items-center justify-center py-16 gap-4 text-zinc-400 dark:text-zinc-500">
              <SvgIcon markup={searchLocateIcon} class="size-12" />
              <p class="text-sm">No results for "{snapshot().query}"</p>
            </div>
          )}

          {!snapshot().isLoading && !snapshot().query && (
            <div class="flex flex-col items-center justify-center py-16 gap-3 text-zinc-300 dark:text-zinc-600">
              <SvgIcon markup={searchIcon} class="size-10" />
              <p class="text-sm">Type to search articles</p>
            </div>
          )}

          {!snapshot().isLoading && snapshot().results.length > 0 && (
            <>
              <ul class="space-y-0.5">
                <For each={displayedResults()}>
                  {(result) => (
                    <li>
                      <a
                        href={result.url}
                        onClick={props.onClose}
                        class="flex flex-col gap-1 px-3 py-2.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700"
                      >
                        <span class="text-sm font-medium text-zinc-800 dark:text-zinc-200">{result.title}</span>
                        {result.excerpt && (
                          <span class="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2" innerHTML={result.excerpt} />
                        )}
                      </a>
                    </li>
                  )}
                </For>
              </ul>
              {hasMore() && (
                <div class="flex justify-center py-3">
                  <button
                    onClick={() => session.loadMore()}
                    class="px-4 py-1.5 rounded-md text-sm bg-zinc-100 dark:bg-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-600 text-zinc-600 dark:text-zinc-300 transition-colors"
                  >
                    Load more ({snapshot().results.length - snapshot().visibleCount} remaining)
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        <div class="flex items-center justify-between px-4 py-2 border-t border-zinc-200 dark:border-zinc-700 text-xs text-zinc-400 dark:text-zinc-500">
          <span>
            <kbd class="px-1 py-0.5 rounded bg-zinc-100 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400 font-mono text-[11px]">Esc</kbd>{" "}
            to close
          </span>
          {snapshot().query && !snapshot().isLoading && (
            <span>Showing {displayedResults().length} of {snapshot().results.length} results</span>
          )}
        </div>
      </div>
    </div>
  );
}
