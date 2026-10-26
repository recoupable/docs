import type { NextConfig } from "next";
import { docsVaryHeader } from "./lib/docs/docsVaryHeader";

const specifications = ["./content/docs/source/api-reference/openapi/*.json"];

export const nextConfig: NextConfig = {
  devIndicators: false,
  // Specifications and published text are read from disk at request time.
  outputFileTracingIncludes: {
    "/spec/*": specifications,
    "/raw/*": specifications,
    "/llms.txt": ["./content/docs/source/llms.txt"],
    "/llms-full.txt": ["./content/docs/source/llms-full.txt"],
    "/.well-known/llms.txt": ["./content/docs/source/llms.txt"],
    "/skill.md": ["./content/docs/source/skill.md"],
    "/.well-known/skills/*": ["./content/docs/source/skill.md"],
    "/.well-known/agent-skills/*": ["./content/docs/source/skill.md"],
    "/og/*": ["./app/icon.svg", "./node_modules/next/dist/compiled/@vercel/og/Geist-Regular.ttf", "./node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff"],
    "/apple-icon": ["./app/icon.svg"],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Link", value: '</llms.txt>; rel="describedby"; type="text/plain"' },
          ...(process.env.VERCEL_ENV === "preview" ? [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] : []),
        ],
      },
      docsVaryHeader,
    ];
  },
};

export default nextConfig;
