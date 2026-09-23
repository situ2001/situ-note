import { useEffect, useState } from "react";
import { BlogListItem, type BlogListItemProps } from "./BlogListItem";

export interface ArchiveYear {
  year: number;
  posts: BlogListItemProps[];
}

export function groupByLocalYear(posts: BlogListItemProps[]): ArchiveYear[] {
  const years = new Map<number, BlogListItemProps[]>();
  for (const post of posts) {
    const year = new Date(post.date).getFullYear();
    const group = years.get(year) ?? [];
    group.push(post);
    years.set(year, group);
  }
  return [...years].sort(([a], [b]) => b - a).map(([year, group]) => ({ year, posts: group }));
}

export default function BlogArchive({ initialYears }: { initialYears: ArchiveYear[] }) {
  const [localYears, setLocalYears] = useState<ArchiveYear[] | null>(null);

  useEffect(() => {
    setLocalYears(groupByLocalYear(initialYears.flatMap(({ posts }) => posts)));
  }, [initialYears]);

  return (
    <div className="space-y-12">
      {(localYears ?? initialYears).map(({ year, posts }) => (
        <section className="flex gap-4 md:gap-8" key={year}>
          <div className="w-16 md:w-24 shrink-0 relative">
            <span className="sticky top-20 block text-3xl md:text-4xl tabular-nums select-none text-zinc-300 dark:text-zinc-700">
              {year}
            </span>
          </div>
          <ul className="flex-1 min-w-0 border-l border-zinc-200 dark:border-zinc-800 pl-4 md:pl-8">
            {posts.map((post) => <BlogListItem {...post} key={post.id} />)}
          </ul>
        </section>
      ))}
    </div>
  );
}
