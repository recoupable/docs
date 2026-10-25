import { siteConfig } from "../config.ts";

/** Recovery links are public, canonical destinations, never reflected input. */
export function markdownNotFound() {
  return new Response(
    `# Page not found\n\nNo published Recoup documentation page exists at this path. Find a valid page in the [documentation index](${siteConfig.url}/llms.txt).\n`,
    {
      status: 404,
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Cache-Control": "no-store",
        "Access-Control-Allow-Origin": "*",
        "X-Content-Type-Options": "nosniff",
        "X-Robots-Tag": "noindex, follow",
        Vary: "Accept",
      },
    },
  );
}
