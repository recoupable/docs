import { absoluteUrl } from "../seo/absoluteUrl.ts";

/** robots.txt: crawling and AI use allowed, with the sitemap, matching what Mintlify served. */
export function robotsText(): string {
  return ["User-agent: *", "Content-Signal: ai-train=yes, search=yes, ai-input=yes", "Allow: /", "", `Sitemap: ${absoluteUrl("/sitemap.xml")}`, ""].join("\n");
}
