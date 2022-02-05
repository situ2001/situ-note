import { Typography } from "@mui/material";
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

const PostHeader = ({ frontMatter }: Props) => {
  const dateObject = new Date(frontMatter.date);
  const y = dateObject.getFullYear();
  const m = dateObject.getMonth() + 1;
  const d = dateObject.getDate();
  const day = dateObject.getDay();

  return (
    <React.Fragment>
      <Typography
        component="div"
        variant="h3"
        sx={{
          fontWeight: "800",
          my: 2,
        }}
      >
        {frontMatter.title}
      </Typography>
      <Typography component="div">{`${y}年${m}月${d}日 ${dayString[day]}`}</Typography>
    </React.Fragment>
  );
};

export default PostHeader;
