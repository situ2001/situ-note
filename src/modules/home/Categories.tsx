import Button from "../../components/common/Button";
import clsx from "clsx";
import underline from '../../components/AnimatedUnderline/index.module.css';
import Card from "../../components/common/Card";
import type { Post } from "@/api/blog";

const Category = ({
  groupedPosts
}: {
  groupedPosts: Record<string, Post[]>
}) => {
  return (
    <section className="h-full flex flex-col gap-4">
      <header className="flex items-center justify-between">
        <h2 className="text-xl font-medium">Categories</h2>
        <a href="/blog/category">
          <Button text="More" className="text-sm opacity-50" />
        </a>
      </header>

      <Card className="h-full">
        <div className="my-1 flex flex-row flex-wrap gap-x-4 gap-y-1">
          {Object.keys(groupedPosts).map((category) => {
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
      </Card>
    </section>
  );
};

export default Category;
