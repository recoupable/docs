import type { Metadata } from "next";
import type { DocPage } from "../docs.ts";
import { docHref } from "../docs-paths.ts";
import { absoluteUrl } from "./absoluteUrl.ts";
import { ogImagePath } from "./ogImagePath.ts";

/** Page metadata: title, description, canonical URL, the page's Markdown alternate and its share image. */
export function documentationMetadata(page: DocPage | undefined, key: string): Metadata {
  const title = page?.title || "API reference";
  const description = page?.description || "Every Recoup API endpoint, with request examples and a live playground.";
  const url = absoluteUrl(docHref(key));
  const shareTitle = key ? `${title} | Recoup Docs` : "Recoup API Documentation";
  const images = [{ url: absoluteUrl(ogImagePath(key)), width: 1200, height: 630, alt: shareTitle }];
  return {
    title: shareTitle,
    description,
    alternates: {
      canonical: url,
      ...(key !== "api-reference" ? { types: { "text/markdown": absoluteUrl(`/raw/${key || "index"}.md`) } } : {}),
    },
    openGraph: { title: shareTitle, description, url, siteName: "Recoup Docs", locale: "en_US", type: "website", images },
    twitter: { card: "summary_large_image", title: shareTitle, description, images },
  };
}
