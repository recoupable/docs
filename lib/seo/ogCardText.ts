import type { DocPage } from "../docs.ts";

const limit = 150;
const plain = (value: string) => value.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/[`*_]/g, "").replace(/\s*[—–]\s*/g, ", ").replace(/\s+/g, " ").trim();
const clip = (value: string) => {
  if (value.length <= limit) return value;
  const cut = value.slice(0, limit - 1);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[,.;:]$/, "")}…`;
};

/** The section label, title and short description drawn on a page's share image. */
export function ogCardText(page: DocPage | undefined, key: string) {
  if (!page) return { eyebrow: "API REFERENCE", title: "API reference", description: "Every Recoup API endpoint, with request examples and a live playground." };
  return {
    eyebrow: page.group.toUpperCase(),
    title: key ? page.title : "Recoup API Documentation",
    description: clip(plain(page.description || "")),
  };
}
