import { visit } from "unist-util-visit";

// Mark only actual off-site HTTP links; anchors, footnotes and image links stay quiet.
export default function externalLinks({ site }) {
  const origin = new URL(site).origin;
  return (tree) => {
    visit(tree, "element", (node) => {
      if (node.tagName !== "a" || typeof node.properties?.href !== "string") return;
      let url;
      try { url = new URL(node.properties.href, site); } catch { return; }
      if (!/^https?:$/.test(url.protocol) || url.origin === origin) return;
      let hasImage = false;
      visit(node, "element", (child) => { if (child.tagName === "img") hasImage = true; });
      if (!hasImage) node.properties.dataExternalLink = true;
    });
  };
}
