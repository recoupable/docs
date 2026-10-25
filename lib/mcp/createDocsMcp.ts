import { McpServer, type McpRequestContext } from "@modelcontextprotocol/server";
import { z } from "zod";
import { docs } from "../docs.ts";
import { documentationAgentMarkdown } from "../agent-markdown.ts";
import { siteConfig } from "../config.ts";
import { searchDocs } from "./searchDocs.ts";
import { resolveDocPage } from "./resolveDocPage.ts";

const readOnly = { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false };
const json = (result: Record<string, unknown>, isError = false) => ({
  ...(isError ? { isError } : {}),
  content: [{ type: "text" as const, text: JSON.stringify(result) }],
  structuredContent: result,
});

/** A fresh read-only docs server per request; links use the origin the client connected to. */
export function createDocsMcp(context?: McpRequestContext) {
  const origin = context?.requestInfo ? new URL(context.requestInfo.url).origin : siteConfig.url;
  const server = new McpServer(
    { name: "recoup-docs", version: "1.0.0", title: "Recoup Docs", websiteUrl: siteConfig.canonicalUrl },
    {
      instructions:
        "Search and read the Recoup developer documentation: platform guides and every API operation with its OpenAPI contract. Use search_docs to find pages, then read_page for a page's full Markdown. Read-only; never send credentials.",
    },
  );
  server.registerTool(
    "search_docs",
    {
      title: "Search documentation",
      description: "Find Recoup guides and API reference pages. Every query word must appear in the page; results are ranked by title match. Returns title, URL, category and, for endpoints, method and path.",
      inputSchema: z.object({ query: z.string().min(1).max(200), limit: z.number().int().min(1).max(30).optional() }),
      annotations: readOnly,
    },
    async ({ query, limit }) => json({ results: searchDocs(docs, query, origin, limit) }),
  );
  server.registerTool(
    "read_page",
    {
      title: "Read a documentation page",
      description: "Read one documentation page as Markdown (the same text as <page>.md), including the endpoint's OpenAPI operation and referenced schemas. Pass a slug such as api-reference/publishing/stats or any docs URL.",
      inputSchema: z.object({ page: z.string().min(1).max(500) }),
      annotations: readOnly,
    },
    async ({ page }) => {
      const found = resolveDocPage(docs, page);
      if (!found) return json({ error: `No documentation page matches "${page}". Use search_docs to find one.` }, true);
      return json({ slug: found.slug, title: found.title, markdown: await documentationAgentMarkdown(found, origin) });
    },
  );
  return server;
}
