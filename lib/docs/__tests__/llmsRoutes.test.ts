import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { GET as getLlms } from "@/app/llms.txt/route";
import { GET as getLlmsFull } from "@/app/llms-full.txt/route";
import { GET as getWellKnownLlms } from "@/app/.well-known/llms.txt/route";
import { docs } from "@/lib/docs";
import { absoluteUrl } from "@/lib/seo/absoluteUrl";

const published = (name: string) => readFileSync(`content/docs/source/${name}`, "utf8");

describe("llms routes", () => {
  it("serves the maintained llms.txt followed by a generated index of every page", async () => {
    const response = await getLlms();
    expect(response.headers.get("content-type")).toBe("text/plain; charset=utf-8");
    const text = await response.text();
    expect(text.startsWith(published("llms.txt").trimEnd())).toBe(true);
    expect(text).toContain("\n## Documentation\n");
    expect(text).toContain("\n## API reference\n");
    for (const page of docs) {
      expect(text).toContain(`](${absoluteUrl(page.slug ? `/${page.slug}.md` : "/index.md")})`);
    }
  });

  it("serves the same index at the well-known path", async () => {
    expect(await (await getWellKnownLlms()).text()).toBe(await (await getLlms()).text());
  });

  it("links only to this docs site, never the retired recoupable.dev/docs copy", async () => {
    expect(await (await getLlms()).text()).not.toContain("recoupable.dev/docs");
  });

  it("serves the generated llms-full.txt verbatim", async () => {
    expect(await (await getLlmsFull()).text()).toBe(published("llms-full.txt"));
  });
});
