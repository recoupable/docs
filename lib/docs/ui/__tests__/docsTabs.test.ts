import { describe, expect, it } from "vitest";
import { docsTabs } from "@/lib/docs/ui/docsTabs";
import { docs } from "@/lib/docs";

describe("docsTabs", () => {
  it("lists each category once, in navigation order, linking its first page", () => {
    const pages = [
      { slug: "", category: "Quickstart" },
      { slug: "quickstart", category: "Quickstart" },
      { slug: "api-reference/artists/list", category: "Artists" },
      { slug: "api-reference/artists/get", category: "Artists" },
    ];
    expect(docsTabs(pages)).toEqual([
      { name: "Quickstart", href: "/" },
      { name: "Artists", href: "/api-reference/artists/list" },
    ]);
  });

  it("leaves out the generated Additional endpoints category, as Mintlify's navigation has no such tab", () => {
    expect(docsTabs([{ slug: "api-reference/complete/x", category: "Additional endpoints" }])).toEqual([]);
  });

  it("matches the twelve tabs of the published navigation", () => {
    expect(docsTabs(docs).map(tab => tab.name)).toEqual([
      "Quickstart", "Artists", "Chats", "Research", "Catalog", "Content", "Social Media",
      "Agents & Sandboxes", "Accounts", "Connectors", "Sites", "Players",
    ]);
  });
});
