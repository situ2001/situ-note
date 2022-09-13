import type { NextApiRequest, NextApiResponse } from "next";
import { getCount, increaseCounter } from "../../../lib/views";
import prisma from "../../../lib/prisma";

export interface ViewResponse {
  message: string;
  count?: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ViewResponse>
) {
  const slug = req.query.slug?.toString();
  if (!slug) {
    res.status(400).json({ message: "Invalid slug" });
    return;
  }

  // check slug is in local db
  // TODO should be moved to remote db
  // const hasSlug = await prisma.post.findFirst({ where: { filename: slug } });
  // if (!hasSlug) {
  //   res.status(400).json({ message: "Such slug is not found" });
  //   return;
  // }

  console.log(slug);
  if (req.method === "POST") {
    // increase
    await increaseCounter(slug!);
  }
  // get counter
  const count = await getCount(slug!);
  if (count === undefined) {
    res.status(500).json({ message: "Internal server error" });
  } else {
    res.status(200).json({ message: "OK", count });
  }
}
