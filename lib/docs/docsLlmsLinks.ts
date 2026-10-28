import { siteConfig } from "../config.ts";

export type DocsLinkPage = { slug: string; title: string; description: string; api?: unknown; category?: string; group?: string };

const oneLine = (value: string) => value.replace(/[\r\n]+/g, " ").replace(/\s+/g, " ").trim();
const label = (value: string) => oneLine(value).replace(/[\\[\]]/g, "\\$&");
const markdownPath = (slug: string) => `/${slug || "index"}.md`;
const line = (page: DocsLinkPage, descriptions: boolean) => `- [${label(page.title)}](${new URL(markdownPath(page.slug), siteConfig.url).href})${descriptions ? `: ${oneLine(page.description)}` : ""}`;

/** llms.txt sections linking every documentation page as Markdown: guides first, then endpoint references. */
export function docsLlmsLinks(pages: readonly DocsLinkPage[], descriptions = true): string {
  function sections(entries: readonly DocsLinkPage[]) {
    const lines: string[] = [];
    let category: string | undefined;
    let group: string | undefined;
    for (const page of entries) {
      if (page.category && page.category !== category) {
        category = page.category;
        group = undefined;
        lines.push(`\n### ${oneLine(category)}\n`);
      }
      if (page.group && page.group !== group) {
        group = page.group;
        if (group !== category) lines.push(`\n#### ${oneLine(group)}\n`);
      }
      lines.push(line(page, descriptions));
    }
    return lines.join("\n").trim();
  }
  const guides = sections(pages.filter(page => !page.api));
  const endpoints = sections(pages.filter(page => page.api));
  return `## Documentation\n\n${guides}\n\n## API reference\n\n${endpoints}`;
}
