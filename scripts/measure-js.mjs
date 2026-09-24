import { readFileSync, statSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { gzipSync } from "node:zlib";

const outputDir = resolve(process.argv[2] ?? "dist");
const pages = process.argv.slice(3);

function pageModules(page) {
  const html = readFileSync(join(outputDir, page), "utf8");
  const urls = [
    ...html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"/g),
    ...html.matchAll(/\b(?:component-url|renderer-url)="([^"]+)"/g),
  ].map((match) => match[1]).filter((url) => url.startsWith("/"));
  return [...new Set(urls.map((url) => join(outputDir, url)))];
}

function importedModules(file, includeDynamic) {
  const source = readFileSync(file, "utf8");
  const staticImports = [...source.matchAll(/\b(?:from|import)\s*["'](\.[^"']+\.js)["']/g)]
    .map((match) => resolve(dirname(file), match[1]));
  const dynamicImports = includeDynamic
    ? [...source.matchAll(/\bimport\(\s*["'`](\.[^"'`]+\.js)["'`]\s*\)/g)]
      .map((match) => resolve(dirname(file), match[1]))
    : [];
  return [...staticImports, ...dynamicImports];
}

function measure(roots, includeDynamic) {
  const seen = new Set();
  const queue = [...roots];
  while (queue.length > 0) {
    const file = queue.pop();
    if (seen.has(file)) continue;
    seen.add(file);
    queue.push(...importedModules(file, includeDynamic));
  }
  return {
    files: [...seen].map((file) => file.slice(outputDir.length)).sort(),
    rawBytes: [...seen].reduce((sum, file) => sum + statSync(file).size, 0),
    gzipBytes: [...seen].reduce((sum, file) => sum + gzipSync(readFileSync(file)).length, 0),
  };
}

const result = Object.fromEntries(pages.map((page) => {
  const roots = pageModules(page);
  return [page, {
    initial: measure(roots, false),
    withDynamicImports: measure(roots, true),
  }];
}));
process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
