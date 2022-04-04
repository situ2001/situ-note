import React from "react";
import type { FrontMatter } from "../types/BlogPost";

type Props = {
  frontMatter: FrontMatter;
};

const dayString = [
  "星期一",
  "星期二",
  "星期三",
  "星期四",
  "星期五",
  "星期六",
  "星期日",
];

// TODO refactor (use tailwind css)
const PostHeader = ({ frontMatter }: Props) => {
  const dateObject = new Date(frontMatter.date);
  const y = dateObject.getFullYear();
  const m = dateObject.getMonth() + 1;
  const d = dateObject.getDate();
  const day = dateObject.getDay();

  return (
    <React.Fragment>
      <h1 className="text-4xl font-extrabold my-2 text-center">{frontMatter.title}</h1>
      <p className="text-center">{`${y}年${m}月${d}日 ${dayString[day]}`}</p>
    </React.Fragment>
  );
};

export default PostHeader;
