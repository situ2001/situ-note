import {
  getPostSortedByDate,
  getPostsGroupByCategory,
  posts as postsData,
  type Post,
} from "../../api/blog";

import clsx from "clsx";
import underline from '../AnimatedUnderline/index.module.css';

const posts = getPostsGroupByCategory(getPostSortedByDate(postsData));

const Category = () => {
  return (
    <section className="h-full flex flex-col gap-2">
      {/* TODO not now but future */}
      {/* <a href="/blog/category"> */}
      <header className="text-xl font-bold">Categories</header>
      {/* </a> */}
      <div className="my-1 flex flex-row flex-wrap gap-x-4 gap-y-1">
        {Object.keys(posts).map((category) => {
          return (
            <div className={
              clsx(underline['fade-in'])
            }>
              <a href={`/blog/category/${category}`}>
                {category}
              </a>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Category;
