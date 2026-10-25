import { expect, test } from "vitest";
import { Client, StreamableHTTPClientTransport } from "@modelcontextprotocol/client";
import { handleDocsMcp } from "@/lib/mcp/handleDocsMcp";

const connect = async () => {
  const client = new Client({ name: "recoup-docs-test", version: "1.0.0" });
  await client.connect(new StreamableHTTPClientTransport(new URL("http://localhost:3000/mcp"), {
    fetch: async (url, init) => handleDocsMcp(new Request(url, init)),
  }));
  return client;
};

test("a real MCP client lists both read-only tools, searches and reads a page", async () => {
  const client = await connect();
  try {
    expect(client.getServerVersion()?.name).toBe("recoup-docs");
    const { tools } = await client.listTools();
    expect(tools.map(tool => tool.name).sort()).toEqual(["read_page", "search_docs"]);
    expect(tools.every(tool => tool.annotations?.readOnlyHint)).toBe(true);

    const search = await client.callTool({ name: "search_docs", arguments: { query: "post stats" } });
    const { results } = search.structuredContent as { results: { slug: string; url: string }[] };
    expect(results[0].slug).toBe("api-reference/publishing/stats");
    expect(results[0].url).toBe("http://localhost:3000/api-reference/publishing/stats");

    const read = await client.callTool({ name: "read_page", arguments: { page: results[0].url } });
    const { markdown } = read.structuredContent as { markdown: string };
    expect(markdown).toMatch(/^# Get Post Stats\n\nSource: http:\/\/localhost:3000\/api-reference\/publishing\/stats\n/);
    expect(markdown).toContain("## GET /api/posts/{id}/stats");

    const missing = await client.callTool({ name: "read_page", arguments: { page: "nope/never" } });
    expect(missing.isError).toBe(true);
  } finally {
    await client.close();
  }
});

test("an untrusted host is refused and preflight is answered", async () => {
  const refused = await handleDocsMcp(new Request("https://evil.example/mcp", { method: "POST" }));
  expect(refused.status).toBe(403);
  const preflight = await handleDocsMcp(new Request("http://localhost:3000/mcp", { method: "OPTIONS" }));
  expect(preflight.status).toBe(204);
  expect(preflight.headers.get("access-control-allow-origin")).toBe("*");
});
