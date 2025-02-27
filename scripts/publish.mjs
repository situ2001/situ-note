#!/usr/bin/env zx

import 'zx/globals';

$.verbose = true;

// ensure you are using node 22
const nodeVersion = await $`node --version`;
if (!nodeVersion.toString().startsWith("v22")) {
  console.error("Please use node v22");
  process.exit(1);
}

// ensure there is no uncommitted changes
const gitStatus = await $`git status --porcelain`;
if (gitStatus.toString() !== "") {
  console.error("Please commit your changes before publishing");
  process.exit(1);
}

// ensure there is no untracked files
const gitUntrackedFiles = await $`git ls-files --others --exclude-standard`;
if (gitUntrackedFiles.toString() !== "") {
  console.error("Please commit your changes before publishing");
  process.exit(1);
}

await $`pnpm install`;

const pwd = await $`pwd`;

process.loadEnvFile(".env");
const OUT_DIR = process.env.OUT_DIR;
console.log("OUT_DIR",OUT_DIR);

if (OUT_DIR !== undefined) {
  // check if dir contain .git
  if (fs.existsSync(path.join(OUT_DIR,".git"))) {
    console.error("OUT_DIR should be under a git repo, not the root of the repo");
    process.exit(1);
  }
}

if (OUT_DIR !== undefined) {
  cd(OUT_DIR);
  const isGitRepo = await $`git rev-parse --is-inside-work-tree`.catch(() => false);
  if (isGitRepo) {
    await $`git reset --hard`;
    await $`git switch dist`;
    await $`git reset --hard origin/dist`;
    await $`git pull origin dist`;
    await $`rm -rf *`;
  }
  cd(pwd);
} else {
  console.log("OUT_DIR is not set, skip cleaning");
}

await $`pnpm build`;
console.log("Site built successfully!");

if (OUT_DIR !== undefined) {
  cd(OUT_DIR);
  try {
    await $`git add .`;
    const dateString = new Date().toLocaleString('en-HK',{ timeZone: 'Asia/Hong_Kong' });
    const commitHash = await $`git rev-parse --short HEAD`;
    await $`git commit -m "Update site: ${dateString} ${commitHash}"`;
    await $`git push origin dist`;
  } catch (e) {
    console.error(e);
    throw new Error("Failed to update site");
  }
  console.log("Site updated successfully!");
  cd(pwd);
} else {
  console.log("OUT_DIR is not set, skip updating site");
}
