import { Post } from "@prisma/client";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { ViewResponse } from "../pages/api/views/[slug]";

type Props = {
  frontMatter: Post;
};

const PostHeader = ({ frontMatter }: Props) => {
  // UTC (But in fact CST) => Real UTC
  const dateObject = new Date(frontMatter.date);
  dateObject.setHours(dateObject.getHours() - 8);
  const realTimeUTC = dateObject.getTime();
  const currentMoment = moment(realTimeUTC);

  const [visitCount, setVisitCount] = useState<number | undefined>(undefined);

  // increase view
  useEffect(() => {
    fetch(`/api/views/${frontMatter.filename}`, { method: "POST" }).then(
      async (res) => {
        const json: ViewResponse = await res.json();
        if (json.count) {
          setVisitCount(json.count);
        }
      }
    );
  }, [frontMatter.filename]);

  return (
    <React.Fragment>
      <h1 className="text-4xl font-extrabold my-2 text-center">
        {frontMatter.title}
      </h1>
      <p className="text-center">{currentMoment.format("ll dddd")}</p>
      <p className="text-center">
        {visitCount ? `${visitCount} views` : "Loading views"}
      </p>
    </React.Fragment>
  );
};

export default PostHeader;
