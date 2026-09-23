import type { LocalImageService } from "astro";
import { baseService } from "astro/assets";
import sharpService from "astro/assets/services/sharp";

const service: LocalImageService = {
  ...baseService,
  ...sharpService,

  getHTMLAttributes(options, imageConfig, logger) {
    const ret = baseService.getHTMLAttributes?.(options, imageConfig, logger);

    // hook, add inline style
    const inlineStyle = ``; // tmp remove

    return { ...ret, style: inlineStyle };
  },
};
export default service;
