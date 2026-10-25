import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/next";
import "@fontsource-variable/dm-sans";
import "@fontsource/ibm-plex-mono/400.css";
import { siteConfig } from "@/lib/config";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: "Recoup Docs",
  description: "Guides and API reference for the Recoup platform.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="docs-site-header">
          <Link href="/">Recoup Docs</Link>
          <nav aria-label="Recoup">
            <a href={siteConfig.appUrl}>App</a>
            <a href={siteConfig.websiteUrl}>Website</a>
          </nav>
        </header>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
