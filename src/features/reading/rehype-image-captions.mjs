import { visit } from "unist-util-visit";

// Only standalone images become figures; images within prose stay inline.
export default function imageCaptions() {
  return (tree) => {
    visit(tree, "element", (node) => {
      if (node.tagName !== "p" || node.children.length !== 1) return;

      const content = node.children[0];
      const image = content.tagName === "a" && content.children.length === 1
        ? content.children[0]
        : content;
      if (image.tagName !== "img" || !image.properties.alt?.trim()) return;

      node.tagName = "figure";
      node.children.push({
        type: "element",
        tagName: "figcaption",
        properties: {},
        children: [{ type: "text", value: image.properties.alt }],
      });
    });
  };
}
