import clsx from "clsx";
import { getTopKPosts, posts as postsData } from "../../api/blog";

const posts = getTopKPosts(postsData, 5);

const LatestBlog = () => {
  return (
    <div className={clsx(
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
            className="my-1 origin-left"
          >
            <a href={`/blog/${post.slug}`}>
              <li>{post.data.title}</li>
            </a>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default LatestBlog;
