import { docHref } from "@/lib/docs-paths";

const GENERATED_CATEGORY = "Additional endpoints";

/** Header tabs: one per navigation category, in order, linking its first page. The generated Additional endpoints category is reachable from the sidebar only. */
export function docsTabs(pages: { slug: string; category: string }[]): { name: string; href: string }[] {
  const tabs: { name: string; href: string }[] = [];
  for (const page of pages) {
    if (page.category === GENERATED_CATEGORY || tabs.some((tab) => tab.name === page.category)) continue;
    tabs.push({ name: page.category, href: docHref(page.slug) });
  }
  return tabs;
}
