import type { NextApiRequest, NextApiResponse } from "next";
import { increaseVisitCounter } from "../../../lib/views";
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

  if (req.method !== "POST") {
    res.status(405).json({ message: "HTTP method now allowed" });
  }

  try {
    const slugCount = await prisma.post.count({ where: { filename: slug } });
    // check slug is in local db
    if (slugCount === 0) {
      res.status(404).json({ message: "Slug not found" });
      return;
    }

    const post = await increaseVisitCounter(slug!);
    res.status(200).json({ message: "Success", count: post.visitCount });
  } catch (e) {
    res.status(500).json({ message: "Internal server error" });
  }
}
