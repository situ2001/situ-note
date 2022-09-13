import { Post } from "@prisma/client";
import moment from "moment";
import React, { useEffect, useState } from "react";
import useSWR, { mutate } from "swr";
import { getFetcher, postFetcher } from "../lib/fecther";
import { ViewResponse } from "../pages/api/views/[slug]";

type Props = {
  frontMatter: Post;
};

// TODO refactor (use tailwind css)
const PostHeader = ({ frontMatter }: Props) => {
  // UTC (But in fact CST) => Real UTC
  const dateObject = new Date(frontMatter.date);
  dateObject.setHours(dateObject.getHours() - 8);
  const realTimeUTC = dateObject.getTime();
  const currentMoment = moment(realTimeUTC);

  const { data, mutate } = useSWR<ViewResponse>(
    `/api/views/${frontMatter.filename}`,
    getFetcher
  );

  // increase view
  useEffect(() => {
    fetch(`/api/views/${frontMatter.filename}`, { method: "POST" }).then(
      // () => mutate() // TODO mutate or not
    );
  }, [frontMatter.filename, mutate]);

  return (
    <React.Fragment>
      <h1 className="text-4xl font-extrabold my-2 text-center">
        {frontMatter.title}
      </h1>
      <p className="text-center">{currentMoment.format("ll dddd")}</p>
      <p className="text-center">{data ? `${data.count} views` : 'Loading views'} </p>
    </React.Fragment>
  );
};

export default PostHeader;
