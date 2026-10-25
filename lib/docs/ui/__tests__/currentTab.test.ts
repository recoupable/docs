import { describe, expect, it } from "vitest";
import { currentTab } from "@/lib/docs/ui/currentTab";

const pages = [
  { slug: "", category: "Quickstart" },
  { slug: "quickstart", category: "Quickstart" },
  { slug: "api-reference/artists/list", category: "Artists" },
];

describe("currentTab", () => {
  it("is the category of the page at the pathname", () => {
    expect(currentTab(pages, "/")).toBe("Quickstart");
    expect(currentTab(pages, "/api-reference/artists/list")).toBe("Artists");
  });

  it("is empty on the API overview and unknown paths, so no tab is highlighted", () => {
    expect(currentTab(pages, "/api-reference")).toBe("");
    expect(currentTab(pages, "/missing")).toBe("");
  });
});
