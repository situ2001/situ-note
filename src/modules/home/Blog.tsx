import clsx from "clsx";
import { getTopKPosts, posts as postsData } from "../../api/blog";
import Button from "../../components/common/Button";
import underline from '../../components/AnimatedUnderline/index.module.css';
import Card from "../../components/common/Card";

const posts = getTopKPosts(postsData, 5);

const Blog = () => {
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
      <Card className="flex-1">
        <ul className="flex flex-col justify-between">
          {posts.map((post) => (
            <div
              key={post.slug}
              className={clsx("my-1 origin-left max-w-fit", underline['fade-in'])}
            >
              <a href={`/blog/${post.slug}`}>
                <li>{post.data.title}</li>
              </a>
            </div>
          ))}
        </ul>
      </Card>
    </section>
  );
};

export default Blog;
