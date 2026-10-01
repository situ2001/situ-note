import path from 'node:path';

/** Obsidian resolution uses the complete vault index, before publication filtering. */
export function createResolver(files: string[]) {
  function resolve(target: string, source: string): string | undefined {
    if (!target) return source;
    let name = target.toLowerCase();
    let basename = path.posix.basename(name);
    let candidates = basename.includes('.') ? files.filter(file => path.posix.basename(file).toLowerCase() === basename) : [];
    if (!candidates.length) {
      name += '.md';
      basename = path.posix.basename(name);
      candidates = files.filter(file => path.posix.basename(file).toLowerCase() === basename);
    }
    if (name === basename && candidates.length === 1) return candidates[0];
    let directory = path.posix.dirname(source).toLowerCase();
    if (directory === '.') directory = '';
    if (name.startsWith('./') || name.startsWith('../')) {
      name = path.posix.normalize(path.posix.join(directory, name));
      const relative = candidates.find(file => file.toLowerCase() === name);
      if (relative) return relative;
    }
    name = name.replace(/^\//, '');
    const exact = candidates.find(file => file.toLowerCase() === name);
    if (exact) return exact;
    if (target.startsWith('/')) return undefined;
    return candidates.filter(file => file.toLowerCase().endsWith(name)).sort((a, b) =>
      Number(!a.toLowerCase().startsWith(directory)) - Number(!b.toLowerCase().startsWith(directory)) || a.length - b.length
    )[0];
  }
  return resolve;
}
