"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import { SkySiteHeader } from "../sky/site-header";
import { GetStartedDialog } from "../sky/get-started-dialog";
import "../sky/header-base.css";
import "../sky/navigation.css";
import "../sky/navigation-mobile.css";
import "../sky/navigation-mobile-menu.css";
import "../sky/navigation-panels.css";
import { currentTab } from "@/lib/docs/ui/currentTab";
import { ThemeToggle } from "./theme-toggle";

type Tab = { name: string; href: string };

/** Marketing global navigation above the documentation sections. */
export function SiteHeader({ pages, tabs }: { pages: { slug: string; category: string }[]; tabs: Tab[] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const tab = currentTab(pages, usePathname());
  return (
    <div className="docs-site-header">
      <div className="sky-site">
        <SkySiteHeader dialog={dialog} />
        <GetStartedDialog ref={dialog} />
      </div>
      <div className="docs-section-bar">
      <nav aria-label="Sections" className="docs-tabs">
        {tabs.map((item) => (
          <Link key={item.name} href={item.href} aria-current={item.name === tab ? "page" : undefined}>{item.name}</Link>
        ))}
      </nav>
      <ThemeToggle />
      </div>
    </div>
  );
}
