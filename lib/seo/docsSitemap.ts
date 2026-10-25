import type { MetadataRoute } from "next";
import { docsRoutes } from "../docs.ts";
import { absoluteUrl } from "./absoluteUrl.ts";

/** Every documentation route, as Mintlify's sitemap listed them. */
export function docsSitemap(): MetadataRoute.Sitemap {
  return docsRoutes.map(route => ({ url: absoluteUrl(route) }));
}
