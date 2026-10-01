import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { parseDocument } from 'yaml';
import type { VaultNote } from '../types.js';

export interface SourceNote extends VaultNote { body: string; id: string }

async function filesIn(root: string, prefix = ''): Promise<string[]> {
  const result: string[] = [];
  for (const entry of await readdir(path.join(root, prefix), { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    const name = path.posix.join(prefix, entry.name);
    if (entry.isDirectory()) result.push(...await filesIn(root, name));
    else if (entry.isFile()) result.push(name); // Never follow symlinks out of the vault.
  }
  return result.sort();
}

export async function readVault(vault: string) {
  const files = await filesIn(vault);
  const notes: SourceNote[] = [];
  for (const file of files.filter(file => file.endsWith('.md'))) {
    const source = await readFile(path.join(vault, file), 'utf8');
    const match = /^\uFEFF?---\r?\n/.test(source) ? source.match(/^\uFEFF?---\r?\n((?:(?!^---(?:\r?$))[\s\S])*?)^---(?:\r?\n|$)/m) : null;
    const yaml = match ? parseDocument(match[1]) : undefined;
    const parsed: unknown = yaml && !yaml.errors.length ? yaml.toJSON() : undefined;
    const properties: Record<string, unknown> = parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed as Record<string, unknown> : {};
    const tagKey = Object.keys(properties).find(key => /^tags$/i.test(key));
    const tagValue: unknown = tagKey ? properties[tagKey] : undefined;
    const tags = (Array.isArray(tagValue) ? tagValue : typeof tagValue === 'string' ? [tagValue] : [])
      .filter((tag): tag is string => typeof tag === 'string').map(tag => tag.trim())
      .filter(tag => tag && !tag.includes(' ')).map(tag => tag.replace(/^#/, ''));
    const note: VaultNote = { path: file, properties, tags };
    notes.push({ ...note, body: match ? source.slice(match[0].length) : source, id: `obsidian/${file.slice(0, -3)}` });
  }
  return { files, notes };
}
