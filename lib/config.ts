/**
 * Recoup API base. Production docs call the production API; previews and local
 * development call the test API, so a key minted on a preview verifies against
 * the matching environment. NEXT_PUBLIC_VERCEL_ENV is inlined from VERCEL_ENV in
 * next.config.ts so this resolves in the client bundle too.
 */
const apiUrl =
  process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
    ? "https://recoup-api.vercel.app/api"
    : "https://test-recoup-api.vercel.app/api";

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
