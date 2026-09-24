import { BlogListItem, type BlogListItemProps } from "./BlogListItem";

export interface ArchiveYear {
  year: number;
  posts: BlogListItemProps[];
}

export default function BlogArchive({ years }: { years: ArchiveYear[] }) {
  return (
    <div class="space-y-12">
      {years.map(({ year, posts }) => (
        <section class="flex gap-4 md:gap-8">
          <div class="w-16 md:w-24 shrink-0 relative">
            <span class="sticky top-20 block text-3xl md:text-4xl tabular-nums select-none text-zinc-300 dark:text-zinc-700">
              {year}
            </span>
          </div>
          <ul class="flex-1 min-w-0 border-l border-zinc-200 dark:border-zinc-800 pl-4 md:pl-8">
            {posts.map((post) => <BlogListItem {...post} />)}
          </ul>
        </section>
      ))}
    </div>
  );
}
