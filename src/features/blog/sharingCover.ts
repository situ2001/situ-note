import { readdirSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import * as fontkit from "fontkit";
import type { Font } from "fontkit";
import sharp from "sharp";
import { logoGlyphPaths } from "../site/logo-glyphs";

const require = createRequire(import.meta.url);
const wordSegments = new Intl.Segmenter("zh", { granularity: "word" });
let fonts: Map<number, Font>;

function loadFont(path: string): Font {
  const font = fontkit.openSync(path);
  if (!("glyphForCodePoint" in font)) throw new Error(`Expected a single font: ${path}`);
  return font;
}

function fontFor(character: string): Font {
  if (!fonts) {
    fonts = new Map();
    const directory = join(dirname(require.resolve("lxgw-wenkai-lite-webfont/package.json")), "files");
    for (const filename of readdirSync(directory).filter((name) => name.startsWith("lxgwwenkailite-regular-"))) {
      const font = loadFont(join(directory, filename));
      for (const code of font.characterSet) fonts.set(code, font);
    }
    const sansDirectory = dirname(require.resolve("@fontsource-variable/noto-sans/files/noto-sans-latin-wght-normal.woff2"));
    for (const filename of readdirSync(sansDirectory).filter((name) => name.endsWith("-wght-normal.woff2"))) {
      const font = loadFont(join(sansDirectory, filename));
      for (const code of font.characterSet) fonts.set(code, font);
    }
  }
  const font = fonts.get(character.codePointAt(0)!);
  if (!font) throw new Error(`Sharing cover font has no glyph for ${character}`);
  return font;
}

function textWidth(text: string, size: number): number {
  return Array.from(text).reduce((width, character) => {
    const font = fontFor(character);
    return width + font.glyphForCodePoint(character.codePointAt(0)!).advanceWidth * size / font.unitsPerEm;
  }, 0);
}

function wrap(text: string, size: number): string[] {
  const lines: string[] = [];
  let line = "";
  const words = Array.from(wordSegments.segment(text.replace(/\s+/g, " ").trim()), ({ segment }) => segment);
  for (const word of words) {
    // Keep words together, splitting only tokens wider than the card's text area.
    const pieces = textWidth(word, size) > 1040 ? Array.from(word) : [word];
    for (const piece of pieces) {
      if (line && textWidth(line + piece, size) > 1040) {
        lines.push(line.trimEnd());
        line = "";
      }
      line += line ? piece : piece.trimStart();
    }
  }
  if (line) lines.push(line.trimEnd());
  return lines;
}

function textPaths(text: string, x: number, baseline: number, size: number, color: string): string {
  let paths = "";
  for (const character of text) {
    const font = fontFor(character);
    const glyph = font.glyphForCodePoint(character.codePointAt(0)!);
    const scale = size / font.unitsPerEm;
    paths += `<path fill="${color}" d="${glyph.path.toSVG()}" transform="translate(${x} ${baseline}) scale(${scale} ${-scale})"/>`;
    x += glyph.advanceWidth * scale;
  }
  return paths;
}

export async function renderSharingCover({ title, description }: {
  title: string;
  description: string;
}): Promise<Buffer> {
  let titleSize = 64;
  let titleLines: string[];
  let descriptionLines: string[];
  let contentHeight: number;
  do {
    titleLines = wrap(title, titleSize);
    descriptionLines = wrap(description, titleSize * 0.44);
    contentHeight = titleLines.length * titleSize * 1.3 + 28 + descriptionLines.length * titleSize * 0.66;
    if (contentHeight <= 350) break;
    titleSize -= 2;
  } while (true);

  let top = 142 + (350 - contentHeight) / 2;
  let text = "";
  for (const line of titleLines) {
    text += textPaths(line, 80, top + titleSize * 0.9, titleSize, "#2f2d2a");
    top += titleSize * 1.3;
  }
  top += 28;
  for (const line of descriptionLines) {
    text += textPaths(line, 80, top + titleSize * 0.44 * 0.9, titleSize * 0.44, "#78716c");
    top += titleSize * 0.66;
  }

  const logo = (["S", "I", "T", "U"] as const).map((character, index) =>
    `<g transform="translate(${index % 2 * 20} ${Math.floor(index / 2) * 20}) scale(1.25)"><path d="${logoGlyphPaths[character]}"/></g>`,
  ).join("");

  // Outline bundled fonts so the static image renders identically without system CJK fonts.
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <rect width="1200" height="630" fill="#faf9f6"/>
    <path d="M1010 0H1200V190C1095 190 1010 105 1010 0Z" fill="#efdde5"/>
    <svg x="80" y="52" width="60" height="60" viewBox="0 0 40 40" fill="#2f2d2a">${logo}</svg>
    ${text}
  </svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer();
}
