import type { LocalImageService, AstroConfig, ImageTransform } from "astro";
import { baseService } from "astro/assets";
import sharpService from "astro/assets/services/sharp";

const service: LocalImageService = {
  validateOptions: baseService.validateOptions,
  getURL: baseService.getURL,
  parseURL: baseService.parseURL,
  getSrcSet: baseService.getSrcSet,
  transform: sharpService.transform,

  getHTMLAttributes(options, imageConfig) {
    const ret = baseService.getHTMLAttributes?.(options, imageConfig);

    // hook, add inline style
    const inlineStyle = `
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
    `;

    return { ...ret, style: inlineStyle } ?? {};
  },
};
export default service;
