import type { Post } from "@/features/blog/blog";
import { BlogListItem } from "@/features/blog/BlogListItem";

const Blog = ({
  posts
}: {
  posts: Post[]
}) => {
  return (
    <section>
      <header
        class="flex items-center justify-between mb-2"
      >
        <h2 class="text-xl font-medium">
          Blogs
        </h2>
      </header>
      <ul>
        {posts.map((post) => <BlogListItem id={post.id} title={post.data.title} date={post.data.date.toISOString()} />)}
      </ul>
    </section>
  );
};

export default Blog;
