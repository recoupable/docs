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

test("a browser visiting /mcp is sent to the MCP server guide; MCP clients are not", async () => {
  const browser = await handleDocsMcp(new Request("http://localhost:3000/mcp", {
    headers: { accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8", "sec-fetch-dest": "document" },
  }));
  expect(browser.status).toBe(308);
  expect(browser.headers.get("location")).toBe("http://localhost:3000/mcp-server");

  const stream = await handleDocsMcp(new Request("http://localhost:3000/mcp", { headers: { accept: "text/event-stream" } }));
  expect(stream.status).not.toBe(308);
  const post = await handleDocsMcp(new Request("http://localhost:3000/mcp", {
    method: "POST",
    headers: { accept: "application/json, text/event-stream", "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "ping" }),
  }));
  expect(post.status).not.toBe(308);
});

test("an untrusted host is refused and preflight is answered", async () => {
  const refused = await handleDocsMcp(new Request("https://evil.example/mcp", { method: "POST" }));
  expect(refused.status).toBe(403);
  const preflight = await handleDocsMcp(new Request("http://localhost:3000/mcp", { method: "OPTIONS" }));
  expect(preflight.status).toBe(204);
  expect(preflight.headers.get("access-control-allow-origin")).toBe("*");
});
