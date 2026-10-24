import type { LocalImageService } from "astro";
import { baseService, getImage } from "astro/assets";
import sharpService from "astro/assets/services/sharp";
import sharp from "sharp";

const service: LocalImageService = {
  ...baseService,
  ...sharpService,

  propertiesToHash: ["src", "width", "height", "format", "quality", "fit", "position", "background", "sharing", "instantView"],

  async transform(input, options, imageConfig, logger) {
    if (options.sharing) {
      // Sharp reads the first GIF frame by default; contain avoids cropping diagrams.
      const data = await sharp(input)
        .rotate()
        .resize(options.width, options.height, { fit: "contain", background: "#ffffff" })
        .flatten({ background: "#ffffff" })
        .jpeg()
        .toBuffer();
      return { data, format: "jpeg" };
    }
    return sharpService.transform(input, options, imageConfig, logger);
  },

  async getHTMLAttributes(options, imageConfig, logger) {
    const ret = await baseService.getHTMLAttributes?.(options, imageConfig, logger);

    // hook, add inline style
    const inlineStyle = ``; // tmp remove

    // IV documents support JPEG, PNG and GIF rather than our browser WebP output.
    const source = typeof options.src === "object" ? options.src : undefined;
    let instantViewSource: string | undefined;
    if (source && !options.instantView && !options.sharing && ["jpg", "jpeg", "png", "gif"].includes(source.format)) {
      // Register a real output: Astro removes originals used only for optimization.
      const compatible = await getImage({
        src: source,
        width: source.width,
        format: source.format,
        instantView: true,
      }, imageConfig, logger);
      instantViewSource = compatible.src;
    }

    return { ...ret, style: inlineStyle, "data-instant-view-src": instantViewSource };
  },
};
export default service;
