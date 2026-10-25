import { createMcpHandler } from "@modelcontextprotocol/server";
import { siteConfig } from "../config.ts";
import { createDocsMcp } from "./createDocsMcp.ts";

// Each HTTP exchange receives its own server; no session depends on a warm function.
const handler = createMcpHandler(createDocsMcp, { maxRequestBodySize: 16_384 });
const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Accept, MCP-Protocol-Version, MCP-Session-Id, MCP-Method, MCP-Name",
  "Access-Control-Expose-Headers": "MCP-Protocol-Version, MCP-Session-Id",
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
};

/** The docs MCP endpoint, guarded to this deployment's own hosts as the website MCP is. */
export async function handleDocsMcp(request: Request) {
  const hosts = [
    new URL(siteConfig.url).host,
    new URL(siteConfig.canonicalUrl).host,
    process.env.VERCEL_URL,
    process.env.VERCEL_BRANCH_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
  ];
  const trustedHost = (host: string) => {
    if (hosts.some(candidate => candidate?.toLowerCase() === host.toLowerCase())) return true;
    if (process.env.VERCEL === "1") return false;
    try {
      return ["localhost", "127.0.0.1", "[::1]"].includes(new URL(`http://${host}`).hostname);
    } catch {
      return false;
    }
  };
  const host = request.headers.get("host");
  if (!trustedHost(new URL(request.url).host) || (host && !trustedHost(host))) {
    return Response.json({ error: "Unrecognized MCP host." }, { status: 403, headers: cors });
  }
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
  const response = await handler.fetch(request);
  for (const [name, value] of Object.entries(cors)) response.headers.set(name, value);
  return response;
}
