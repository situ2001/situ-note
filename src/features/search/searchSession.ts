const PAGEFIND_PATH = "/pagefind/pagefind.js";
const PAGE_SIZE = 10;

export interface SearchResult {
  url: string;
  title: string;
  excerpt: string;
}

interface SearchHit {
  data(): Promise<{ url: string; excerpt: string; meta?: { title?: string } }>;
}

export interface SearchIndex {
  debouncedSearch(
    term: string,
    options?: undefined,
    debounceTimeoutMs?: number,
  ): Promise<{ results: SearchHit[] }>;
}

export interface SearchSnapshot {
  query: string;
  results: SearchResult[];
  visibleCount: number;
  isLoading: boolean;
  initError: boolean;
}

let pagefindCache: Pagefind | null = null;
let pagefindLoading: Promise<Pagefind> | null = null;

export function loadPagefind(): Promise<Pagefind> {
  if (pagefindCache) return Promise.resolve(pagefindCache);
  if (pagefindLoading) return pagefindLoading;

  // @vite-ignore — served by astro-pagefind at runtime
  pagefindLoading = import(/* @vite-ignore */ PAGEFIND_PATH)
    .then(async (mod: Pagefind) => {
      await mod.init();
      pagefindCache = mod;
      return mod;
    })
    .catch((error: unknown) => {
      pagefindLoading = null;
      throw error;
    });
  return pagefindLoading;
}

export class SearchSession {
  private index: SearchIndex | null = null;
  private generation = 0;
  private lifecycle = 0;
  private disposed = false;
  private listeners = new Set<() => void>();
  private snapshot: SearchSnapshot = {
    query: "",
    results: [],
    visibleCount: PAGE_SIZE,
    isLoading: true,
    initError: false,
  };

  constructor(private readonly loadIndex: () => Promise<SearchIndex>) {}

  getSnapshot = (): SearchSnapshot => this.snapshot;

  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  private update(patch: Partial<SearchSnapshot>) {
    if (this.disposed) return;
    this.snapshot = { ...this.snapshot, ...patch };
    this.listeners.forEach((listener) => listener());
  }

  async initialize() {
    this.disposed = false;
    const lifecycle = ++this.lifecycle;
    try {
      this.index = await this.loadIndex();
      if (this.disposed || lifecycle !== this.lifecycle) return;
      this.update({ isLoading: false, initError: false });
      if (this.snapshot.query.trim()) void this.search(this.snapshot.query.trim(), this.generation);
    } catch (error) {
      if (this.disposed || lifecycle !== this.lifecycle) return;
      console.error("Failed to load pagefind:", error);
      this.update({ isLoading: false, initError: true });
    }
  }

  setQuery(value: string) {
    const generation = ++this.generation;
    this.update({
      query: value,
      results: [],
      visibleCount: PAGE_SIZE,
      isLoading: Boolean(value.trim()) && !this.snapshot.initError,
    });
    if (value.trim() && this.index) void this.search(value.trim(), generation);
  }

  loadMore() {
    this.update({ visibleCount: this.snapshot.visibleCount + PAGE_SIZE });
  }

  private async search(term: string, generation: number) {
    if (!this.index) return;
    this.update({ isLoading: true });
    try {
      const search = await this.index.debouncedSearch(term, undefined, 300);
      const results = await Promise.all(
        search.results.map(async (hit) => {
          const data = await hit.data();
          return {
            url: data.url,
            title: data.meta?.title || "",
            excerpt: data.excerpt,
          };
        }),
      );
      if (generation !== this.generation || this.disposed) return;
      this.update({ results, isLoading: false });
    } catch (error) {
      if (generation !== this.generation || this.disposed) return;
      console.error("Search failed:", error);
      this.update({ results: [], isLoading: false });
    }
  }

  dispose() {
    this.disposed = true;
    ++this.lifecycle;
    ++this.generation;
    this.listeners.clear();
  }
}
