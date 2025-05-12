import type { Post } from "@/api/blog";
import React from "react";
import FormattedDate from "./FormattedDate";
import clsx from "clsx";

export function BlogListItem({
  post
}: {
  post: Post
}) {
  return (
    <a
      href={`/blog/${post.slug}`}
      title={post.data.title}
      className={
        clsx(
          "flex w-full flex-col md:flex-row justify-between",
          "rounded-lg py-2.5 md:px-2",
          "transition-all active:scale-[0.995]",
          "md:hover:bg-zinc-100 md:hover:dark:bg-zinc-700",
        )
      }
    >
      <div className="flex-1">
        <span>{post.data.title}</span>
      </div>

      <span className="text-sm text-zinc-500">
        <FormattedDate date={post.data.date} />
      </span>
    </a>
  )
}
