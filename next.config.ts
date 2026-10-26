import type { NextConfig } from "next";
import { docsVaryHeader } from "./lib/docs/docsVaryHeader";
import { discoveryLinkHeader } from "./lib/agent-discovery/discoveryLinkHeader";

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
    "/.well-known/agent-card.json": ["./content/docs/source/skill.md"],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Link", value: discoveryLinkHeader },
          ...(process.env.VERCEL_ENV === "preview" ? [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] : []),
        ],
      },
      docsVaryHeader,
    ];
  },
};

export default nextConfig;
