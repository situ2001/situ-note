import clsx from "clsx";
import { getTopKPosts, posts as postsData } from "../../api/blog";

import underline from '../AnimatedUnderline/index.module.css';

const posts = getTopKPosts(postsData, 5);

const LatestBlog = () => {
  return (
    <section className={clsx(
      "h-full flex flex-col gap-2",
    )}>
      <header
        className="flex"
      >
        <h2 className="text-xl font-bold">
          Blog
        </h2>

        <a href="/blog" className="block ml-auto">
          <span className="ml-auto opacity-50">More {">"}</span>
        </a>
      </header>
      <ul className="flex flex-col justify-between flex-1">
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
    </section>
  );
};

export default LatestBlog;
