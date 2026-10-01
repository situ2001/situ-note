import { readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { sanitizeSvg } from './transform/html.js';

export function createAssets(vault: string, base: string) {
  const prefix = `${base.replace(/\/$/, '')}/_obsidian/`;
  const assets = new Map<string, Buffer>();
  async function publishAsset(target: string) {
    let bytes = await readFile(path.join(vault, target));
    const extension = path.extname(target).toLowerCase();
    if (extension === '.svg') bytes = Buffer.from(sanitizeSvg(bytes.toString('utf8')));
    const name = createHash('sha256').update(bytes).digest('hex').slice(0, 24) + extension;
    assets.set(name, bytes);
    return prefix + name;
  }
  return {
    publish: publishAsset,
    has: (url: string) => url.startsWith(prefix) && assets.has(url.slice(prefix.length)),
    get size() { return assets.size; },
    async write(directory: string) {
      if (assets.size) await mkdir(directory, { recursive: true });
      for (const [name, bytes] of assets) await writeFile(path.join(directory, name), bytes);
    },
  };
}
