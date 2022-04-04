import moment from "moment";
import React from "react";
import type { FrontMatter } from "../types/BlogPost";

type Props = {
  frontMatter: FrontMatter;
};

// TODO refactor (use tailwind css)
const PostHeader = ({ frontMatter }: Props) => {
  // UTC (But in fact CST) => Real UTC
  const dateObject = new Date(frontMatter.date);
  dateObject.setHours(dateObject.getHours() - 8);
  const realTimeUTC = dateObject.toString();
  const currentMoment = moment(realTimeUTC);

  return (
    <React.Fragment>
      <h1 className="text-4xl font-extrabold my-2 text-center">
        {frontMatter.title}
      </h1>
      <p className="text-center">{currentMoment.format("ll dddd")}</p>
    </React.Fragment>
  );
};

export default PostHeader;
