import { z } from "zod";

const readOnly = { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false };

/** The docs MCP server's identity and tool contracts, shared by the server and its discovery card. */
export const docsMcpDefinition = {
  serverInfo: { name: "recoup-docs", version: "1.0.0", title: "Recoup Docs" },
  instructions:
    "Search and read the Recoup developer documentation: platform guides and every API operation with its OpenAPI contract. Use search_docs to find pages, then read_page for a page's full Markdown. Read-only; never send credentials.",
  tools: {
    search_docs: {
      title: "Search documentation",
      description: "Find Recoup guides and API reference pages. Every query word must appear in the page; results are ranked by title match. Returns title, URL, category and, for endpoints, method and path.",
      inputSchema: z.object({ query: z.string().min(1).max(200), limit: z.number().int().min(1).max(30).optional() }),
      annotations: readOnly,
    },
    read_page: {
      title: "Read a documentation page",
      description: "Read one documentation page as Markdown (the same text as <page>.md), including the endpoint's OpenAPI operation and referenced schemas. Pass a slug such as api-reference/publishing/stats or any docs URL.",
      inputSchema: z.object({ page: z.string().min(1).max(500) }),
      annotations: readOnly,
    },
  },
};
