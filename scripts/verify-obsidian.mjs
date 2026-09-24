// Runs the real Astro build twice against a disposable external vault.
import sharp from 'sharp';
import assert from 'node:assert/strict';
import { mkdtemp, cp, readFile, writeFile, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
const temp = await mkdtemp(join(tmpdir(), 'astro-obsidian-build-'));
const vault = join(temp, 'vault');
const dist = join(temp, 'dist');
const article = join(dist, 'blog/obsidian/Publish/中文 空格/index.html');
async function allFiles(dir) {
  const output = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const file = join(dir, entry.name);
    output.push(...(entry.isDirectory() ? await allFiles(file) : [file]));
  }
  return output;
}
async function build(name) {
  const run = spawnSync(process.execPath, ['node_modules/astro/bin/astro.mjs', 'build'], {
    env: { ...process.env, OBSIDIAN_VAULT: vault, OUT_DIR: dist }, encoding: 'utf8',
  });
  await writeFile(join(temp, `${name}.log`), run.stdout + run.stderr);
  assert.equal(run.status, 0, `Build failed; inspect ${temp}/${name}.log`);
}
try {
  await cp(resolve('test/fixtures/obsidian-vault'), vault, { recursive: true });
  await build('publish');
  const html = await readFile(article, 'utf8');
  assert.match(html, /PUBLIC_PROVIDER_SENTINEL/);
  assert.match(html, /<time dateTime="2026-09-19T16:00:00\.000Z">Sep 20, 2026<\/time>/);
  assert.match(html, /href="\/blog\/obsidian\/Publish\/Second\/"/);
  assert.match(html, /<code>\[\[Secret\]\]<\/code>/);
  assert.match(html, /class="katex"/);
  for (const element of ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'strong', 'em', 'del', 'blockquote', 'table', 'thead', 'tbody', 'ol', 'ul', 'hr', 'br']) {
    assert.match(html, new RegExp(`<${element}[ >]`), `Missing Markdown element: ${element}`);
  }
  assert.equal((html.match(/class="katex-display"/g) ?? []).length, 5, 'Five display equations');
  assert.ok((html.match(/class="katex"/g) ?? []).length >= 12, 'Inline and display math');
  assert.doesNotMatch(html, /katex-error/);
  assert.match(html, /type="checkbox"[^>]*checked|checked[^>]*type="checkbox"/);
  assert.match(html, /data-footnotes/);
  assert.match(html, /<p>Second<\/p>/, 'Note embed stays plain text despite same-name reference definition');
  assert.match(html, /<td[^>]*><a href="\/blog\/obsidian\/Publish\/Second\/">公开目标<\/a><\/td>/, 'Wiki alias in table');
  assert.match(html, /data-footnote-backref/);
  assert.match(html, /<code>\$x\^2\$<\/code>/);
  assert.match(html, /href="#latex"/);
  assert.match(html, /id="latex"/);
  assert.match(html, /data-language="typescript"/);
  assert.match(html, /data-language="mermaid"/);
  const images = await readdir(join(dist, '_obsidian'));
  assert.equal(images.length, 1);
  const dimensions = await sharp(join(dist, '_obsidian', images[0])).metadata();
  assert.equal(dimensions.width, 1600);
  assert.equal(dimensions.height, 900);
  assert.match(html, new RegExp(images[0]));
  const feed = await readFile(join(dist, 'rss.xml'), 'utf8');
  assert.match(feed, /PUBLIC_PROVIDER_SENTINEL/);
  assert.match(feed, /<pubDate>Sat, 19 Sep 2026 16:00:00 GMT<\/pubDate>/);
  assert.ok((await readdir(join(dist, 'blog'))).length > 10, 'Existing posts remain');
  for (const file of await allFiles(dist)) {
    const bytes = await readFile(file);
    assert.ok(!bytes.includes('PRIVATE_BODY_SENTINEL_94107'), `Private body leaked: ${file}`);
    assert.ok(!bytes.includes('PRIVATE_ATTACHMENT_SENTINEL'), `Private image leaked: ${file}`);
  }
  for (const file of ['Publish/中文 空格.md', 'Publish/Second.md']) {
    const location = join(vault, file);
    await writeFile(location, (await readFile(location, 'utf8')).replace('shared: true', 'shared: false'));
  }
  await build('withdraw');
  await assert.rejects(readFile(article));
  await assert.rejects(readdir(join(dist, '_obsidian')));
  for (const file of await allFiles(dist)) {
    assert.ok(!(await readFile(file)).includes('PUBLIC_PROVIDER_SENTINEL'), `Stale public content: ${file}`);
  }
  console.log('PASS: original posts, vault rendering, RSS, links/images, private exclusion and withdrawal.');
  console.log(`Build logs: ${temp}`);
} finally {
  // Only the loader's owned attachment output; leave logs and dist for inspection.
  await rm(resolve('public/_obsidian'), { recursive: true, force: true });
}
