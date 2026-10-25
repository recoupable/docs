import type { DocPage } from "../docs.ts";

/**
 * The page a slug, path or URL names. Accepts any host (production, previews, the old
 * recoupable.dev/docs paths), a .md/.mdx suffix, the /raw Markdown path and a #fragment.
 */
export function resolveDocPage(pages: readonly DocPage[], ref: string): DocPage | undefined {
  let path = ref.trim();
  if (/^https?:\/\//i.test(path)) path = new URL(path).pathname;
  const slug = path
    .split(/[?#]/)[0]
    .replace(/^\/+|\/+$/g, "")
    .replace(/^docs(\/|$)/, "")
    .replace(/^raw\//, "")
    .replace(/\.mdx?$/, "");
  const key = slug === "index" ? "" : slug;
  return pages.find(page => page.slug === key);
}
