import { cleanup, clone } from "./clone-repo.mjs";
import { parseMarkdownPost } from "./parse-markdown.mjs";
import prisma from "./prisma.mjs";

async function main() {
  // clone repo
  await clone();

  // parse markdown and save to db
  await parseMarkdownPost();

  // cleanup repo
  cleanup();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    await prisma.$disconnect();
    console.error(e);
    process.exit(1);
  });
