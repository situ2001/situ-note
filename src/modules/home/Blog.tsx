import clsx from "clsx";
import type { Post } from "../../api/blog";
import Button from "../../components/common/Button";
import underline from '../../components/AnimatedUnderline/index.module.css';
import Card from "../../components/common/Card";
import { BlogListItem } from "@/components/BlogListItem";

const Blog = ({
  posts
}: {
  posts: Post[]
}) => {
  return (
    <section className={clsx(
      "h-full flex flex-col gap-4",
    )}>
      <header
        className="flex items-center justify-between"
      >
        <h2 className="text-xl font-medium">
          Blogs
        </h2>

        <a href="/blog">
          <Button text="More" className="ml-auto text-sm opacity-50" />
        </a>
      </header>
      <ul>
        {posts.map((post) => <BlogListItem post={post} key={post.slug} />)}
      </ul>
    </section>
  );
};

export default Blog;
