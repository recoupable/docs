import { docHref } from "@/lib/docs-paths";

/** The header tab a pathname belongs to: its page's category, or "" (no tab) on the API overview and unknown paths. */
export function currentTab(pages: { slug: string; category: string }[], pathname: string): string {
  return pages.find((page) => docHref(page.slug) === pathname)?.category ?? "";
}
