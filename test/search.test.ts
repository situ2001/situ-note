import { expect, test } from "vitest";
import { SearchSession, type SearchIndex } from "../src/features/search/searchSession";

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((done) => { resolve = done; });
  return { promise, resolve };
}

test("clearing a query ignores its pending results", async () => {
  const pending = deferred<Awaited<ReturnType<SearchIndex["debouncedSearch"]>>>();
  const index: SearchIndex = { debouncedSearch: () => pending.promise };
  const session = new SearchSession(async () => index);
  await session.initialize();

  session.setQuery("old");
  session.setQuery("");
  pending.resolve({ results: [{ data: async () => ({ url: "/blog/old", excerpt: "old" }) }] });
  await new Promise((resolve) => setTimeout(resolve, 0));

  expect(session.getSnapshot()).toMatchObject({ query: "", results: [], isLoading: false });
  session.dispose();
});

test("a newer query wins even if old result hydration finishes last", async () => {
  const oldData = deferred<{ url: string; excerpt: string }>();
  const index: SearchIndex = {
    debouncedSearch: async (term) => ({
      results: [{ data: () => term === "old" ? oldData.promise : Promise.resolve({ url: "/blog/new", excerpt: "new" }) }],
    }),
  };
  const session = new SearchSession(async () => index);
  await session.initialize();

  session.setQuery("old");
  await Promise.resolve();
  session.setQuery("new");
  await new Promise((resolve) => setTimeout(resolve, 0));
  oldData.resolve({ url: "/blog/old", excerpt: "old" });
  await new Promise((resolve) => setTimeout(resolve, 0));

  expect(session.getSnapshot().results.map((result) => result.url)).toEqual(["/blog/new"]);
  session.dispose();
});
