import { describe, expect, it } from "vitest";
import { docs } from "@/lib/docs";
import { resolveDocPage } from "@/lib/mcp/resolveDocPage";

const slug = "api-reference/publishing/stats";

describe("resolveDocPage", () => {
  it.each([
    slug,
    `/${slug}`,
    `${slug}.md`,
    `/${slug}.mdx`,
    `/raw/${slug}.md`,
    `https://docs.recoupable.dev/${slug}`,
    `https://docs-site-git-x-recoup.vercel.app/${slug}.md#responses`,
    `https://recoupable.dev/docs/${slug}`,
  ])("resolves %s", ref => {
    expect(resolveDocPage(docs, ref)?.slug).toBe(slug);
  });

  it("maps the root and index to the introduction page", () => {
    expect(resolveDocPage(docs, "/")?.slug).toBe("");
    expect(resolveDocPage(docs, "index")?.slug).toBe("");
    expect(resolveDocPage(docs, "https://docs.recoupable.dev")?.slug).toBe("");
  });

  it("returns undefined for an unknown page", () => {
    expect(resolveDocPage(docs, "api-reference/nope")).toBeUndefined();
  });
});
