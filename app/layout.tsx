import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/next";
import "@fontsource-variable/dm-sans";
import "@fontsource/ibm-plex-mono/400.css";
import { siteConfig } from "@/lib/config";
import { docs } from "@/lib/docs";
import { docsTabs } from "@/lib/docs/ui/docsTabs";
import { SiteHeader } from "@/components/docs/site-header";
import { SiteFooter } from "@/components/docs/site-footer";
import "./globals.css";
import "./docs-theme.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: "Recoup Docs",
  description: "Guides and API reference for the Recoup platform.",
};

/** Applies the saved or system theme before paint (same rule as lib/docs/ui/effectiveTheme). */
const themeScript = `try{var s=localStorage.getItem("recoup-docs-theme");document.documentElement.dataset.theme=s==="light"||s==="dark"?s:matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}catch(e){}`;

const navPages = docs.map(({ slug, category }) => ({ slug, category }));

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <SiteHeader pages={navPages} tabs={docsTabs(docs)} />
        {children}
        <SiteFooter />
        <Analytics />
      </body>
    </html>
  );
}
