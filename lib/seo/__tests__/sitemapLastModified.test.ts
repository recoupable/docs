import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";
import { parseGitLastModified } from "@/lib/seo/parseGitLastModified";

describe("sitemap lastmod", () => {
  it("keeps the newest commit date per file from git log output", () => {
    const log = "2026-10-26T01:00:00-04:00\n\ncontent/docs/source/a.mdx\n\n2026-10-20T01:00:00-04:00\n\ncontent/docs/source/a.mdx\ncontent/docs/source/b.mdx\n";
    expect(parseGitLastModified(log)).toEqual(new Map([
      ["content/docs/source/a.mdx", "2026-10-26T05:00:00.000Z"],
      ["content/docs/source/b.mdx", "2026-10-20T05:00:00.000Z"],
    ]));
  });

  it("dates every page from its source history", () => {
    const entries = sitemap();
    const dated = entries.filter(entry => typeof entry.lastModified === "string");
    expect(dated.length).toBe(entries.length);
    for (const entry of dated) expect(Number.isNaN(Date.parse(entry.lastModified as string))).toBe(false);
  });
});
