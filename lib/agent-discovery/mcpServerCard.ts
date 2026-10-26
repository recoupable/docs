import { z } from "zod";
import { docsMcpDefinition } from "../mcp/docsMcpDefinition.ts";
import { absoluteUrl } from "../seo/absoluteUrl.ts";

/** /.well-known/mcp/server-card.json describing the read-only docs MCP server at /mcp, in Mintlify's card format. */
export function mcpServerCard() {
  const { serverInfo, tools } = docsMcpDefinition;
  return {
    name: "Recoup Docs MCP",
    description: "Search and read the Recoup developer documentation and OpenAPI contracts",
    version: serverInfo.version,
    serverInfo: { name: serverInfo.name, version: serverInfo.version },
    url: absoluteUrl("/mcp"),
    transport: "http",
    capabilities: { tools: true },
    authentication: "none",
    tools: Object.entries(tools).map(([name, tool]) => ({
      name,
      description: tool.description,
      inputSchema: z.toJSONSchema(tool.inputSchema, { io: "input" }),
      annotations: { title: tool.title, ...tool.annotations },
    })),
  };
}
