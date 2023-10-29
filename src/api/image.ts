import type { LocalImageService, AstroConfig, ImageTransform } from "astro";
import { baseService } from "astro/assets";
import sharpService from "astro/assets/services/sharp";

const service: LocalImageService = {
  ...baseService,
  ...sharpService,

  getHTMLAttributes(options, imageConfig) {
    const ret = baseService.getHTMLAttributes?.(options, imageConfig);

    // hook, add inline style
    const inlineStyle = ``; // tmp remove

    return { ...ret, style: inlineStyle } ?? {};
  },
};
export default service;
