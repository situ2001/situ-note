import { getPostsGroupByCategory } from "../api/blog";

const posts = getPostsGroupByCategory();

export const Category = () => {
  return (
    <div class="h-full flex flex-col">
      {/* TODO not now but future */}
      {/* <a href="/blog/category"> */}
      <header class="text-xl font-bold">Categories</header>
      {/* </a> */}
      <hr class="my-1" />
      <div class="my-1">
        {Object.keys(posts).map((category) => {
          return (
            <span class="mr-4 inline-block relative">
              <a
                class="hover:underline underline-offset-4"
                href={`/blog/category/${category}`}
              >
                {category}
              </a>
            </span>
          );
        })}
      </div>
    </div>
  );
};
