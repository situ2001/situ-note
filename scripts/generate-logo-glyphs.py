#!/usr/bin/env python3
"""Regenerate the site logo's SVG paths from Inconsolata.

The source font is @fontsource-variable/inconsolata 5.2.8, licensed under
src/features/site/Inconsolata-OFL.txt. It lives in scripts/assets so the
website build never serves it.

Run with:
    uv run --no-project --with fonttools==4.66.0 --with brotli \
        python scripts/generate-logo-glyphs.py

Add --check to verify the committed paths without rewriting them.
"""

import argparse
from pathlib import Path

from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont


ROOT = Path(__file__).resolve().parents[1]
FONT_PATH = ROOT / "scripts/assets/inconsolata-latin-wght-normal.woff2"
OUTPUT_PATH = ROOT / "src/features/site/logo-glyphs.ts"
CHARS = "012SITU"


def number_to_string(number):
    return ("%.3f" % number).rstrip("0").rstrip(".") if number else "0"


def generate():
    font = instantiateVariableFont(TTFont(FONT_PATH), {"wght": 600}, inplace=False)
    if font["head"].unitsPerEm != 1000:
        raise ValueError("Expected Inconsolata's 1000-unit em square")

    glyphs = font.getGlyphSet()
    char_to_glyph = font.getBestCmap()
    lines = [
        "// Inconsolata outlines at weight 600, positioned in the former 16px logo cells.",
        "// Source: @fontsource-variable/inconsolata (SIL Open Font License 1.1).",
        "export const logoGlyphPaths = {",
    ]
    for char in CHARS:
        name = char_to_glyph[ord(char)]
        if font["hmtx"][name][0] != 500:
            raise ValueError(f"Expected a 500-unit advance for {char}")

        pen = SVGPathPen(glyphs, ntos=number_to_string)
        # 16px / 1000 units, centered 8px-wide glyph in a 16px cell.
        # Flip the font's Y axis and place its baseline at the original 13.35px.
        transformed = TransformPen(pen, (0.016, 0, 0, -0.016, 4, 13.35))
        glyphs[name].draw(transformed)
        lines.append(f"  '{char}': '{pen.getCommands()}',")

    lines.append("} as const;")
    return "\n".join(lines) + "\n"


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="Check that the output is current")
    args = parser.parse_args()

    generated = generate()
    if args.check:
        if OUTPUT_PATH.read_text() != generated:
            parser.exit(1, f"Outdated: {OUTPUT_PATH}\n")
        print(f"Up to date: {OUTPUT_PATH}")
    else:
        OUTPUT_PATH.write_text(generated)
        print(f"Wrote: {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
