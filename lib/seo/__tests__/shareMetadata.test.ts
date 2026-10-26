import { describe, expect, it } from "vitest";
import { docs } from "@/lib/docs";
import { absoluteUrl } from "@/lib/seo/absoluteUrl";
import { documentationMetadata } from "@/lib/seo/documentationMetadata";
import { documentationJsonLd } from "@/lib/seo/documentationJsonLd";
import { ogImagePath } from "@/lib/seo/ogImagePath";
import { ogCardText } from "@/lib/seo/ogCardText";

const page = (slug: string) => docs.find(item => item.slug === slug)!;

describe("share metadata Mintlify served", () => {
  it("points each page at its own 1200x630 share image", () => {
    expect(ogImagePath("")).toBe("/og");
    expect(ogImagePath("api-reference/publishing/stats")).toBe("/og/api-reference/publishing/stats");
    const metadata = documentationMetadata(page("quickstart"), "quickstart");
    const image = { url: absoluteUrl("/og/quickstart"), width: 1200, height: 630, alt: "Quickstart | Recoup Docs" };
    expect(metadata.openGraph?.images).toEqual([image]);
    expect(metadata.twitter).toMatchObject({ card: "summary_large_image", images: [image] });
  });

  it("titles the home page Recoup API Documentation", () => {
    expect(documentationMetadata(page(""), "").title).toBe("Recoup API Documentation");
  });

  it("adds Organization and WebSite structured data", () => {
    const graph = documentationJsonLd(page("quickstart"), "quickstart")["@graph"] as { "@type": string }[];
    expect(graph.find(node => node["@type"] === "Organization")).toMatchObject({ name: "Recoup", url: "https://recoupable.dev" });
    expect(graph.find(node => node["@type"] === "WebSite")).toMatchObject({ url: absoluteUrl("/"), name: "Recoup Docs" });
  });

  it("labels the card with the section, title and a short description", () => {
    expect(ogCardText(page(""), "")).toMatchObject({ title: "Recoup API Documentation" });
    expect(ogCardText(undefined, "api-reference")).toMatchObject({ eyebrow: "API REFERENCE", title: "API reference" });
    const stats = ogCardText(page("api-reference/publishing/stats"), "api-reference/publishing/stats");
    expect(stats.eyebrow).toBe("PUBLISHING");
    expect(stats.title).toBe("Get Post Stats");
    for (const item of docs) {
      const text = ogCardText(item, item.slug);
      expect(text.description.length).toBeLessThanOrEqual(150);
      expect(text.description).not.toMatch(/[—–]/);
    }
  });
});
