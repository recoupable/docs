import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { GET as getServerCard } from "@/app/.well-known/mcp/server-card.json/route";
import { GET as getAgentCard } from "@/app/.well-known/agent-card.json/route";
import { handleDocsMcp } from "@/lib/mcp/handleDocsMcp";
import { absoluteUrl } from "@/lib/seo/absoluteUrl";
import { skillDescription } from "@/lib/agent-discovery/skillDescription";
import { negotiateDocsMarkdown } from "@/lib/docs/negotiateDocsMarkdown";
import nextConfig from "@/next.config";

const skill = readFileSync("content/docs/source/skill.md", "utf8");

async function listedTools() {
  const response = await handleDocsMcp(new Request(absoluteUrl("/mcp"), {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json, text/event-stream", "mcp-protocol-version": "2025-06-18" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/list", params: {} }),
  }));
  const text = await response.text();
  const payload = JSON.parse(text.startsWith("{") ? text : text.split("\n").find(line => line.startsWith("data: "))!.slice(6));
  return payload.result.tools as { name: string; description: string; inputSchema: Record<string, unknown> }[];
}

describe("agent discovery cards Mintlify served", () => {
  it("serves an MCP server card for the docs MCP server at /mcp", async () => {
    const response = await getServerCard();
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("application/json");
    const card = await response.json();
    expect(card).toMatchObject({
      url: absoluteUrl("/mcp"),
      transport: "http",
      authentication: "none",
      serverInfo: { name: "recoup-docs", version: "1.0.0" },
      capabilities: { tools: true },
    });
    expect(card.capabilities.resources).toBeUndefined();
  });

  it("lists exactly the tools the MCP server returns from tools/list", async () => {
    const card = await (await getServerCard()).json();
    const tools = await listedTools();
    expect(card.tools.map((tool: { name: string }) => tool.name)).toEqual(tools.map(tool => tool.name));
    for (const tool of tools) {
      const carded = card.tools.find((entry: { name: string }) => entry.name === tool.name);
      expect(carded.description).toBe(tool.description);
      expect(carded.inputSchema).toEqual(tool.inputSchema);
      expect(carded.annotations.readOnlyHint).toBe(true);
    }
  });

  it("serves an agent card that points at the maintained skill", async () => {
    const response = await getAgentCard();
    expect(response.headers.get("content-type")).toBe("application/json");
    const card = await response.json();
    expect(card).toMatchObject({
      name: "Recoup",
      url: absoluteUrl("/"),
      documentationUrl: absoluteUrl("/"),
      provider: { organization: "Recoup", url: absoluteUrl("/") },
      skills: [{ id: "recoup", name: "recoup", description: skillDescription(skill), url: absoluteUrl("/.well-known/agent-skills/recoup/skill.md") }],
    });
    expect(card.supportedInterfaces).toBeUndefined();
    expect(card.preferredTransport).toBeUndefined();
  });

  it("advertises every discovery file in the Link header with Mintlify's relation names", async () => {
    const rules = await nextConfig.headers!();
    const link = rules.find(rule => rule.source === "/(.*)")!.headers.find(header => header.key === "Link")!.value;
    for (const relation of [
      '</llms.txt>; rel="llms-txt"',
      '</llms-full.txt>; rel="llms-full-txt"',
      '</.well-known/mcp/server-card.json>; rel="mcp-server-card"',
      '</.well-known/agent-card.json>; rel="agent-card"',
      '</.well-known/agent-skills/index.json>; rel="agent-skills"',
    ]) expect(link).toContain(relation);
    expect(link).not.toContain("api-catalog");
  });

  it("never rewrites the cards to page markdown", () => {
    for (const path of ["/.well-known/mcp/server-card.json", "/.well-known/agent-card.json"]) {
      expect(negotiateDocsMarkdown(path, "text/markdown")).toBeNull();
    }
  });
});
