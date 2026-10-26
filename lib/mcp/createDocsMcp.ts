import { McpServer, type McpRequestContext } from "@modelcontextprotocol/server";
import { docs } from "../docs.ts";
import { documentationAgentMarkdown } from "../agent-markdown.ts";
import { siteConfig } from "../config.ts";
import { searchDocs } from "./searchDocs.ts";
import { resolveDocPage } from "./resolveDocPage.ts";
import { docsMcpDefinition } from "./docsMcpDefinition.ts";

const { serverInfo, instructions, tools } = docsMcpDefinition;
const json = (result: Record<string, unknown>, isError = false) => ({
  ...(isError ? { isError } : {}),
  content: [{ type: "text" as const, text: JSON.stringify(result) }],
  structuredContent: result,
});

/** A fresh read-only docs server per request; links use the origin the client connected to. */
export function createDocsMcp(context?: McpRequestContext) {
  const origin = context?.requestInfo ? new URL(context.requestInfo.url).origin : siteConfig.url;
  const server = new McpServer({ ...serverInfo, websiteUrl: siteConfig.canonicalUrl }, { instructions });
  server.registerTool(
    "search_docs",
    tools.search_docs,
    async ({ query, limit }) => json({ results: searchDocs(docs, query, origin, limit) }),
  );
  server.registerTool(
    "read_page",
    tools.read_page,
    async ({ page }) => {
      const found = resolveDocPage(docs, page);
      if (!found) return json({ error: `No documentation page matches "${page}". Use search_docs to find one.` }, true);
      return json({ slug: found.slug, title: found.title, markdown: await documentationAgentMarkdown(found, origin) });
    },
  );
  return server;
}
