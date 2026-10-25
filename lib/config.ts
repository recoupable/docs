/**
 * Recoup API base for the playground and request examples: always production,
 * the same server the OpenAPI specs declare. The api `test` deployment stopped
 * tracking main when the test-branch flow was retired, so previews call
 * production too.
 */
const apiUrl = "https://api.recoupable.dev/api";

const canonicalUrl = "https://docs.recoupable.dev";
const vercelUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined;

/** Docs-site configuration. NEXT_PUBLIC_SITE_URL lets a build emit absolute URLs for itself. */
export const siteConfig = {
  name: "Recoup",
  url: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.VERCEL_ENV === "production" ? canonicalUrl : vercelUrl || "http://localhost:3000"),
  ).origin,
  canonicalUrl,
  apiUrl,
  websiteUrl: "https://recoupable.dev",
  appUrl: "https://chat.recoupable.dev",
};
