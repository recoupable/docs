import type { MetadataRoute } from "next";
import { docs, docHref } from "../docs.ts";
import { absoluteUrl } from "./absoluteUrl.ts";
import { pageLastModified } from "./pageLastModified.ts";

/** Every documentation route, as Mintlify's sitemap listed them, dated by its source's last git change. */
export function docsSitemap(): MetadataRoute.Sitemap {
  const pages = docs.map(page => ({ url: absoluteUrl(docHref(page.slug)), lastModified: pageLastModified(page) }));
  const overview = pages.filter((_, index) => docs[index].api).map(entry => entry.lastModified).filter(Boolean).sort().at(-1);
  pages.splice(1, 0, { url: absoluteUrl("/api-reference"), lastModified: overview });
  return pages.map(({ url, lastModified }) => (lastModified ? { url, lastModified } : { url }));
}
