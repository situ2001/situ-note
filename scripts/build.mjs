#!/usr/bin/env zx

import 'zx/globals';

$.verbose = true;

await $`pnpm install`;

const pwd = await $`pwd`;

process.loadEnvFile(".env");
const OUT_DIR = process.env.OUT_DIR;
console.log("OUT_DIR",OUT_DIR);

if (OUT_DIR !== undefined) {
  cd(OUT_DIR);
  const isGitRepo = await $`git rev-parse --is-inside-work-tree`.catch(() => false);
  if (isGitRepo) {
    await $`git reset --hard`;
    await $`git checkout dist`;
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
    await $`git commit -m "Update site: ${dateString}"`;
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
