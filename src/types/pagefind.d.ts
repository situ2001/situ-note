/**
 * Type declaration for the Pagefind browser module served at /pagefind/pagefind.js.
 * The `pagefind` npm package only exports Node.js/service-side types,
 * so browser-side types are declared here.
 */

interface PagefindSearchOptions {
  /** Filters to apply */
  filters?: Record<string, string[]>;
  /** Sort configuration */
  sort?: Record<string, 'asc' | 'desc'>;
}

interface PagefindSearchResult {
  id: string;
  /** Score from 0–1 */
  score: number;
  words: number[];
  data: () => Promise<PagefindResultData>;
}

interface PagefindResultData {
  url: string;
  excerpt: string;
  meta: Record<string, string>;
  /** Raw path, may include index.html */
  raw_url?: string;
  /** Sub-results for different headings */
  sub_results?: Array<{
    title: string;
    url: string;
    excerpt: string;
  }>;
}

interface Pagefind {
  init: () => Promise<void>;
  search: (
    term: string,
    options?: PagefindSearchOptions,
  ) => Promise<{ results: PagefindSearchResult[] }>;
  debouncedSearch: (
    term: string,
    options?: PagefindSearchOptions,
    debounceTimeoutMs?: number,
  ) => Promise<{ results: PagefindSearchResult[] }>;
  filters: () => Promise<Record<string, Record<string, number>>>;
  destroy: () => Promise<void>;
  mergeIndex: (indexPath: string, options?: Record<string, unknown>) => Promise<void>;
  options: (newOptions: Record<string, unknown>) => Promise<void>;
  preload: (term: string, options?: PagefindSearchOptions) => Promise<void>;
}

declare module '/pagefind/pagefind.js' {
  const pagefind: Pagefind;
  export = pagefind;
}
