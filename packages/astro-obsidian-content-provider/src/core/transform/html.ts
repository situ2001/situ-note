import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
const window = new JSDOM('').window;
const purify = createDOMPurify(window);

export const escapeHtml = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
export function sanitizeSvg(source: string): string {
  return purify.sanitize(source, { USE_PROFILES: { svg: true, svgFilters: true } });
}
export async function cleanHtml(html: string, rewrite: (url: string, image: boolean) => Promise<string | undefined>, scope = '', footnotesOnly = false): Promise<string> {
  const container = window.document.createElement('div');
  container.innerHTML = purify.sanitize(html, { ADD_TAGS: ['iframe'], ADD_ATTR: ['allowfullscreen'], ALLOW_UNKNOWN_PROTOCOLS: true });
  for (const element of container.querySelectorAll('[href], [src], [poster], [srcset]')) {
    // Local responsive sources must also go through attachment selection. Generated images use src.
    if (element.hasAttribute('srcset')) {
      const candidates = element.getAttribute('srcset')!.split(',');
      const rewritten: string[] = [];
      for (const candidate of candidates) {
        const [url, ...descriptor] = candidate.trim().split(/\s+/);
        const target = await rewrite(url, true);
        if (target) rewritten.push([target, ...descriptor].join(' '));
      }
      if (rewritten.length) element.setAttribute('srcset', rewritten.join(', '));
      else element.removeAttribute('srcset');
    }
    for (const attribute of ['href', 'src', 'poster']) {
      if (!element.hasAttribute(attribute)) continue;
      const url = await rewrite(element.getAttribute(attribute)!, attribute !== 'href');
      if (url !== undefined) element.setAttribute(attribute, url);
      else if (attribute === 'href') element.replaceWith(...element.childNodes);
      else element.removeAttribute(attribute);
    }
  }
  if (scope) {
    const ids = new Map<string, string>();
    for (const element of container.querySelectorAll('[id]')) {
      if (footnotesOnly && !/^(user-content-fn|footnote-label)/.test(element.id)) continue;
      ids.set(element.id, scope + element.id);
      element.id = scope + element.id;
    }
    for (const element of container.querySelectorAll('[href], [aria-describedby], [aria-labelledby]')) {
      const href = element.getAttribute('href');
      if (href?.startsWith('#') && ids.has(href.slice(1))) element.setAttribute('href', '#' + ids.get(href.slice(1))!);
      for (const attribute of ['aria-describedby', 'aria-labelledby']) {
        const value = element.getAttribute(attribute);
        if (value) element.setAttribute(attribute, value.split(/\s+/).map(id => ids.get(id) ?? id).join(' '));
      }
    }
  }
  return container.innerHTML;
}
