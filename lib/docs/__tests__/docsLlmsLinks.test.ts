import { describe, expect, it } from "vitest";
import { docsLlmsLinks } from "@/lib/docs/docsLlmsLinks";
import { docs } from "@/lib/docs";
import { siteConfig } from "@/lib/config";

const pages = [
  { slug: "", title: "Recoup API Documentation", description: "Index.", api: undefined },
  { slug: "quickstart", title: "Quickstart", description: "Get a key\nand go.", api: undefined },
  { slug: "api-reference/artists/list", title: "Get [Artists]", description: "List artists.", api: { method: "GET", path: "/api/artists", spec: "accounts.json" } },
];

describe("docsLlmsLinks", () => {
  it("lists guide pages under Documentation and endpoint pages under API reference", () => {
    const text = docsLlmsLinks(pages);
    const [, guides, api] = text.split(/^## /m);
    expect(guides.startsWith("Documentation\n")).toBe(true);
    expect(api.startsWith("API reference\n")).toBe(true);
    expect(guides).toContain(`- [Recoup API Documentation](${siteConfig.url}/index.md): Index.`);
    expect(guides).toContain(`- [Quickstart](${siteConfig.url}/quickstart.md): Get a key and go.`);
    expect(guides).not.toContain("artists/list");
    expect(api).toContain(`- [Get \\[Artists\\]](${siteConfig.url}/api-reference/artists/list.md): List artists.`);
  });

  it("emits one link per page of the real manifest", () => {
    const text = docsLlmsLinks(docs);
    expect(text.match(/^- \[/gm)?.length).toBe(docs.length);
    expect(text).not.toContain(`${siteConfig.url}/docs/`);
  });
});
