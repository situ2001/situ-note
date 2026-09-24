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
        className="flex items-center justify-between mb-2"
      >
        <h2 className="text-xl font-medium">
          Blogs
        </h2>
      </header>
      <ul>
        {posts.map((post) => <BlogListItem id={post.id} title={post.data.title} date={post.data.date.toISOString()} key={post.id} />)}
      </ul>
    </section>
  );
};

export default Blog;
