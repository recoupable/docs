import type { DocPage } from "../docs.ts";
import { docHref } from "../docs-paths.ts";

type DocsSearchResult = { slug: string; title: string; url: string; category: string; method?: string; path?: string };

/**
 * Pages whose search text contains every query word, ranked like the sidebar search:
 * exact title, title phrase, endpoint path, then the number of title words matched.
 */
export function searchDocs(pages: readonly DocPage[], query: string, origin: string, limit = 10): DocsSearchResult[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];
  const words = normalized.split(/\s+/);
  const score = (page: DocPage) => {
    const title = page.title.toLowerCase();
    if (title === normalized) return 100;
    if (title.includes(normalized)) return 60;
    if (page.api?.path.toLowerCase().includes(normalized)) return 40;
    return words.filter(word => title.includes(word)).length * 10;
  };
  return pages
    .filter(page => words.every(word => `${page.searchText} ${page.api?.path ?? ""}`.toLowerCase().includes(word)))
    .map(page => ({ page, rank: score(page) }))
    .sort((a, b) => b.rank - a.rank)
    .slice(0, limit)
    .map(({ page }) => ({
      slug: page.slug,
      title: page.title,
      url: new URL(docHref(page.slug), origin).href,
      category: page.category,
      ...(page.api ? { method: page.api.method, path: page.api.path } : {}),
    }));
}
