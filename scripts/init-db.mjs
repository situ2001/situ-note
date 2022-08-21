import { exec, spawn } from "child_process";
import { existsSync } from "fs";
import path from "path";

export async function initDB() {
  // TODO check if production or development
  if (!existsSync(path.join(process.cwd(), "db", "dev.db"))) {
    const promise = new Promise((resolve, reject) => {
      const out = exec(
        "npx prisma migrate dev",
        { cwd: process.cwd() },
        (err, stdout) => {
          console.log(stdout);
        }
      );
      out.on("exit", () => resolve());
    });
    await promise;
  }
}
