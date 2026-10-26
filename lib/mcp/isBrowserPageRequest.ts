/**
 * Whether a request to /mcp wants the human guide rather than the docs MCP endpoint.
 * /mcp is the endpoint; the guide moved to /mcp-server, but older links (search results,
 * recoupable.dev/docs/mcp) still arrive here. MCP clients always POST, or GET with
 * `Accept: text/event-stream` (required by the Streamable HTTP transport), so any other
 * GET is a browser, crawler, curl or markdown reader; /mcp-server negotiates markdown itself.
 */
export function isBrowserPageRequest(request: Request): boolean {
  if (request.method !== "GET" && request.method !== "HEAD") return false;
  const accept = request.headers.get("accept")?.toLowerCase() ?? "";
  return !accept.includes("text/event-stream");
}
