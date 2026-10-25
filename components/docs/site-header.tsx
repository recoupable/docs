"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/lib/config";
import { currentTab } from "@/lib/docs/ui/currentTab";
import { Brand } from "./brand";
import { ThemeToggle } from "./theme-toggle";

type Tab = { name: string; href: string };

/** Mintlify's docs header: brand, the global anchors, Support, the Dashboard button and the theme toggle; then one tab per navigation section. */
export function SiteHeader({ pages, tabs }: { pages: { slug: string; category: string }[]; tabs: Tab[] }) {
  const tab = currentTab(pages, usePathname());
  return (
    <header className="docs-site-header">
      <div className="docs-site-header-row">
        <Brand />
        <nav aria-label="Recoup" className="docs-site-links">
          {siteConfig.anchors.map((anchor) => (
            <a key={anchor.label} href={anchor.href} className="docs-desktop-only">{anchor.label}</a>
          ))}
          <a href={`mailto:${siteConfig.supportEmail}`} className="docs-desktop-only">Support</a>
          <a href={siteConfig.appUrl} className="docs-dashboard-button">Dashboard</a>
          <ThemeToggle />
        </nav>
      </div>
      <nav aria-label="Sections" className="docs-tabs">
        {tabs.map((item) => (
          <Link key={item.name} href={item.href} aria-current={item.name === tab ? "page" : undefined}>{item.name}</Link>
        ))}
      </nav>
    </header>
  );
}
