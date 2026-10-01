import type { Extension, Tokenizer } from 'micromark-util-types';
import type { Extension as MdastExtension } from 'mdast-util-from-markdown';
import type { Root } from 'mdast';
import type { Processor } from 'unified';

declare module 'micromark-util-types' { interface TokenTypeMap { obsidianMark: 'obsidianMark' } }
declare module 'mdast' { interface Data { obsidianMark?: boolean } }
const tokenize: Tokenizer = function (effects, ok, nok) {
  let previous: number | null = null;
  let count = 0;
  return start;
  function start(code: number | null) {
    if (code !== 61) return nok(code);
    effects.enter('obsidianMark'); effects.consume(code); return second;
  }
  function second(code: number | null) {
    if (code !== 61) return nok(code);
    effects.consume(code); return inside;
  }
  function inside(code: number | null): ReturnType<Tokenizer> | undefined {
    if (code === null || code < 0) return nok(code);
    if (!count && (code === 61 || /\s/.test(String.fromCharCode(code)))) return nok(code);
    if (code === 61 && previous !== null && !/\s/.test(String.fromCharCode(previous))) {
      effects.consume(code); return close;
    }
    count++; previous = code; effects.consume(code); return inside;
  }
  function close(code: number | null) {
    if (code === 61) { effects.consume(code); effects.exit('obsidianMark'); return ok; }
    previous = 61; return inside(code);
  }
};
export default function remarkObsidianMark(this: Processor) {
  const parser = this;
  const syntax: Extension = { text: { 61: { name: 'obsidianMark', tokenize } } };
  const mdast: MdastExtension = {
    enter: { obsidianMark(token) {
      const content = parser.parse(this.sliceSerialize(token).slice(2, -2)) as Root;
      const paragraph = content.children[0];
      this.enter({ type: 'strong', data: { obsidianMark: true }, children: paragraph?.type === 'paragraph' ? paragraph.children : [] }, token);
    } },
    exit: { obsidianMark(token) { this.exit(token); } },
  };
  const data = this.data();
  (data.micromarkExtensions ??= []).push(syntax);
  (data.fromMarkdownExtensions ??= []).push(mdast);
}
