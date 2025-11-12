import type { Post } from "@/api/blog";
import React from "react";
import FormattedDate from "./FormattedDate";
import clsx from "clsx";

export function BlogListItem({
  post,
}: {
  post: Post,
}) {
  return (
    <a
      href={`/blog/${post.slug}`}
      title={post.data.title}
      className={
        clsx(
          "flex w-full flex-col md:flex-row justify-between",
          "rounded-lg py-2.5",
          "transition-all active:scale-[0.995]",
          "group",
        )
      }
    >
      <div className="flex-1">
        <span className="relative inline-block">
          {post.data.title}
          <span className="absolute bottom-0 left-0 w-0 h-px bg-current transition-all duration-300 ease-in-out group-hover:w-full" />
        </span>
      </div>

      <span className="text-sm text-zinc-500">
        <FormattedDate date={post.data.date} />
      </span>
    </a>
  )
}
