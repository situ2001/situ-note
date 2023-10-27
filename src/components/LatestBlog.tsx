import { getCollection } from "astro:content";
import { createSignal } from "solid-js";

const posts = (await getCollection("blog"))
  .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
  .slice(0, 5);

type Post = (typeof posts)[0];

export const LatestBlog = () => {
  const [hoveredElement, setHoveredElement] = createSignal<Post | null>(null);
  const [isPointerOverBlogList, setIsPointerOverBlogList] = createSignal(false);

  return (
    <div class="h-full flex flex-col">
      <header
        class="text-xl font-bold transition-all duration-150"
        style={{
          opacity: !isPointerOverBlogList() ? 1 : 0.3,
        }}
      >
        Latest Blog Posts
      </header>
      <hr class="my-1" />
      {/* <section class="overflow-scroll flex-1"> */}
      <ul
        onPointerOver={() => setIsPointerOverBlogList(true)}
        onPointerOut={() => setIsPointerOverBlogList(false)}
        class="flex flex-col justify-between flex-1"
      >
        {posts.map((post) => (
          <div
            onPointerOver={() => setHoveredElement(post)}
            onPointerOut={() => setHoveredElement(null)}
            class={`my-1 transition-all duration-150 hover:scale-105 origin-left`}
            style={{
              opacity:
                !isPointerOverBlogList() || hoveredElement() === post ? 1 : 0.3,
            }}
          >
            <a href={`/blog/${post.slug}`}>
              <li>{post.data.title}</li>
            </a>
          </div>
        ))}
      </ul>
      {/* </section> */}
    </div>
  );
};
