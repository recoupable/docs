import type { NextConfig } from "next";
import { docsVaryHeader } from "./lib/docs/docsVaryHeader";

const specifications = ["./content/docs/source/api-reference/openapi/*.json"];

export const nextConfig: NextConfig = {
  devIndicators: false,
  env: { NEXT_PUBLIC_VERCEL_ENV: process.env.VERCEL_ENV ?? "development" },
  // Specifications and published text are read from disk at request time.
  outputFileTracingIncludes: {
    "/spec/*": specifications,
    "/raw/*": specifications,
    "/llms.txt": ["./content/docs/source/llms.txt"],
    "/llms-full.txt": ["./content/docs/source/llms-full.txt"],
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
