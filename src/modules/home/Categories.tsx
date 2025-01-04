import {
  getPostSortedByDate,
  getPostsGroupByCategory,
  posts as postsData,
  type Post,
} from "../../api/blog";
import Button from "../../components/common/Button";
import clsx from "clsx";
import underline from '../../components/AnimatedUnderline/index.module.css';

const posts = getPostsGroupByCategory(getPostSortedByDate(postsData));

const Category = () => {
  return (
    <section className="h-full flex flex-col gap-2">
      <header className="flex items-center justify-between">
        <h2 className="text-xl font-medium">Categories</h2>
        <a href="/blog/category">
          <Button text="More" className="text-sm opacity-50" />
        </a>
      </header>

      <div className="p-4 border rounded-lg h-full dark:border-gray-700">
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
      </div>
    </section>
  );
};

export default Category;
