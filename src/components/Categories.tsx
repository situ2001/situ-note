import {
  getPostSortedByDate,
  getPostsGroupByCategory,
  posts as postsData,
  type Post,
} from "../api/blog";

const posts = getPostsGroupByCategory(getPostSortedByDate(postsData));

export const Category = () => {
  return (
    <div className="h-full flex flex-col">
      {/* TODO not now but future */}
      {/* <a href="/blog/category"> */}
      <header className="text-xl font-bold">Categories</header>
      {/* </a> */}
      <hr className="my-1" />
      <div className="my-1">
        {Object.keys(posts).map((category) => {
          return (
            <span className="mr-4 inline-block relative">
              <a
                className="hover:underline underline-offset-4"
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
