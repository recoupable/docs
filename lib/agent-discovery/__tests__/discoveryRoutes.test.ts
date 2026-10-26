import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";
import { GET as getRobots } from "@/app/robots.txt/route";
import { GET as getSkill } from "@/app/skill.md/route";
import { GET as getSkillsIndex } from "@/app/.well-known/skills/index.json/route";
import { GET as getSkillsFile } from "@/app/.well-known/skills/recoup/SKILL.md/route";
import { GET as getAgentSkillsIndex } from "@/app/.well-known/agent-skills/index.json/route";
import { GET as getAgentSkillsFile } from "@/app/.well-known/agent-skills/recoup/skill.md/route";
import { docsRoutes } from "@/lib/docs";
import { absoluteUrl } from "@/lib/seo/absoluteUrl";
import { negotiateDocsMarkdown } from "@/lib/docs/negotiateDocsMarkdown";

const published = (name: string) => readFileSync(`content/docs/source/${name}`, "utf8");

describe("search and agent discovery routes Mintlify served", () => {
  it("lists every docs route in the sitemap as an absolute URL", () => {
    const urls = sitemap().map(entry => entry.url);
    expect(urls).toHaveLength(docsRoutes.length);
    expect(urls).toContain(absoluteUrl("/"));
    expect(urls).toContain(absoluteUrl("/api-reference/publishing/stats"));
  });

  it("serves robots.txt that allows crawling and points at the sitemap", async () => {
    const response = getRobots();
    expect(response.headers.get("content-type")).toBe("text/plain; charset=utf-8");
    const text = await response.text();
    expect(text).toContain("User-agent: *\n");
    expect(text).toContain("Content-Signal: ai-train=yes, search=yes, ai-input=yes\n");
    expect(text).toContain(`Sitemap: ${absoluteUrl("/sitemap.xml")}\n`);
  });

  it("serves the maintained skill at /skill.md and both well-known skill paths", async () => {
    for (const get of [getSkill, getSkillsFile, getAgentSkillsFile]) {
      const response = await get();
      expect(response.headers.get("content-type")).toBe("text/markdown; charset=utf-8");
      expect(await response.text()).toBe(published("skill.md"));
    }
  });

  it("indexes the skill for both well-known discovery formats", async () => {
    const skill = published("skill.md");
    const description = skill.match(/^description: (.+)$/m)?.[1];
    expect(description).toMatch(/Recoup/);
    expect(await (await getSkillsIndex()).json()).toEqual({
      skills: [{ name: "recoup", description, files: ["SKILL.md"] }],
    });
    expect(await (await getAgentSkillsIndex()).json()).toEqual({
      $schema: "https://schemas.agentskills.io/discovery/0.2.0/schema.json",
      skills: [{
        name: "recoup",
        type: "skill-md",
        description,
        url: "/.well-known/agent-skills/recoup/skill.md",
        digest: `sha256:${createHash("sha256").update(skill).digest("hex")}`,
      }],
    });
  });

  it("never rewrites the discovery files to page markdown", () => {
    for (const path of ["/skill.md", "/.well-known/skills/recoup/SKILL.md", "/.well-known/llms.txt"]) {
      expect(negotiateDocsMarkdown(path, "text/markdown")).toBeNull();
    }
  });

  it("ships a real ICO favicon", () => {
    expect([...readFileSync("app/favicon.ico").subarray(0, 4)]).toEqual([0, 0, 1, 0]);
  });
});
