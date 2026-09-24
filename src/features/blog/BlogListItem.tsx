import FormattedDate from "@/features/blog/FormattedDate";
import clsx from "clsx";

export interface BlogListItemProps {
  id: string;
  title: string;
  date: string;
}

export function BlogListItem({
  id,
  title,
  date,
}: BlogListItemProps) {
  return (
    <a
      href={`/blog/${id}`}
      title={title}
      class={
        clsx(
          "flex w-full flex-col md:flex-row justify-between",
          "rounded-lg py-2.5",
          "transition-all active:scale-[0.995]",
          "group",
        )
      }
    >
      <div class="flex-1">
        <span class="relative inline-block">
          {title}
          <span class="absolute bottom-0 left-0 w-0 h-px bg-current transition-all duration-300 ease-in-out group-hover:w-full" />
        </span>
      </div>

      <span class="text-sm text-zinc-500">
        <FormattedDate date={date} />
      </span>
    </a>
  )
}
