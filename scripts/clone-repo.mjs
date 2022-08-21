import git from "isomorphic-git";
import http from "isomorphic-git/http/node/index.cjs";
import fs from "fs";
import { cloneTargetDir } from "./constant.mjs";

export async function clone() {
  console.log("Start cloning...");
  await git.clone({
    fs,
    http,
    dir: cloneTargetDir,
    depth: 1,
    url: "https://github.com/situ2001/blog-posts",
  });
  console.log("Done cloning");
}

export function cleanup() {
  console.log("Cleaning up...");
  if (fs.existsSync(cloneTargetDir)) {
    fs.rmSync(cloneTargetDir, { recursive: true, force: true });
  }
  console.log("Cleaned up");
}
