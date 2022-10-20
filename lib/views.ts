import prisma from "./prisma";

export const increaseVisitCounter = async (slug: string) => {
  return await prisma.post.update({
    where: {
      filename: slug,
    },
    data: { visitCount: { increment: 1 } },
  });
};
