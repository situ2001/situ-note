import type { Extension, Tokenizer } from 'micromark-util-types';
import type { Extension as MdastExtension } from 'mdast-util-from-markdown';
import type { Processor } from 'unified';

declare module 'micromark-util-types' {
  interface TokenTypeMap { obsidianWiki: 'obsidianWiki' }
}

// Parse wiki syntax before CommonMark reference links can claim its brackets.
// A syntax extension also naturally leaves escaped brackets and code untouched.
const tokenize: Tokenizer = function (effects, ok, nok) {
  let contentLength = 0;
  return start;
  function start(code: number | null) {
    effects.enter('obsidianWiki');
    if (code === 33) { effects.consume(code); return firstBracket; }
    return firstBracket(code);
  }
  function firstBracket(code: number | null) {
    if (code !== 91) return nok(code);
    effects.consume(code);
    return secondBracket;
  }
  function secondBracket(code: number | null) {
    if (code !== 91) return nok(code);
    effects.consume(code);
    return inside;
  }
  function inside(code: number | null): ReturnType<Tokenizer> | undefined {
    if (code === null || code === -5 || code === -4 || code === -3 || code === 91) return nok(code);
    if (code === 93) {
      if (!contentLength) return nok(code);
      effects.consume(code);
      return close;
    }
    contentLength++;
    effects.consume(code);
    return inside;
  }
  function close(code: number | null) {
    if (code !== 93) return nok(code);
    effects.consume(code);
    effects.exit('obsidianWiki');
    return ok;
  }
};

export default function remarkObsidianLinks(this: Processor) {
  const syntax: Extension = { text: {
    33: { name: 'obsidianWiki', tokenize },
    91: { name: 'obsidianWiki', tokenize },
  } };
  const mdast: MdastExtension = {
    enter: {
      obsidianWiki(token) {
        const raw = this.sliceSerialize(token);
        const image = raw.startsWith('!');
        const content = raw.slice(image ? 3 : 2, -2).replace(/\\\|/g, '|');
        const separator = content.indexOf('|');
        const url = separator < 0 ? content : content.slice(0, separator);
        const label = separator < 0 ? content : content.slice(separator + 1);
        this.enter(image
          ? { type: 'image', url, alt: label }
          : { type: 'link', url, children: [{ type: 'text', value: label }] }, token);
      },
    },
    exit: { obsidianWiki(token) { this.exit(token); } },
  };
  const data = this.data();
  (data.micromarkExtensions ??= []).push(syntax);
  (data.fromMarkdownExtensions ??= []).push(mdast);
}
