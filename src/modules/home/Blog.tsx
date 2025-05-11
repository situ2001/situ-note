import type { Post } from "../../api/blog";
import { BlogListItem } from "@/components/BlogListItem";
import More from "@/components/common/More";

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

        <More href="/blog" />
      </header>
      <ul>
        {posts.map((post) => <BlogListItem post={post} key={post.slug} />)}
      </ul>
    </section>
  );
};

export default Blog;
