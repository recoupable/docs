import { describe, expect, it } from "vitest";
import { docs } from "@/lib/docs";
import { searchDocs } from "@/lib/mcp/searchDocs";

describe("searchDocs", () => {
  it("ranks the exact endpoint page first for its title words", () => {
    const [first] = searchDocs(docs, "post stats", "https://docs.recoupable.dev");
    expect(first).toEqual({
      slug: "api-reference/publishing/stats",
      title: "Get post stats",
      url: "https://docs.recoupable.dev/api-reference/publishing/stats",
      category: "Connectors",
      method: "GET",
      path: "/api/posts/{id}/stats",
    });
  });

  it("matches an endpoint path and omits method/path for guides", () => {
    expect(searchDocs(docs, "/api/posts/{id}/stats", "https://x.test")[0].slug).toBe("api-reference/publishing/stats");
    const guide = searchDocs(docs, "quickstart", "https://x.test").find(result => result.slug === "quickstart");
    expect(guide).toBeDefined();
    expect(guide).not.toHaveProperty("method");
  });

  it("requires every word, caps results, and returns nothing for a blank query", () => {
    expect(searchDocs(docs, "zzzz-no-such-word", "https://x.test")).toEqual([]);
    expect(searchDocs(docs, "   ", "https://x.test")).toEqual([]);
    expect(searchDocs(docs, "api", "https://x.test", 3)).toHaveLength(3);
  });
});
