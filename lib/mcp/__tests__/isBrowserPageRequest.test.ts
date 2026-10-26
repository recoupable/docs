import { describe, expect, it } from "vitest";
import { isBrowserPageRequest } from "@/lib/mcp/isBrowserPageRequest";

const request = (method: string, accept?: string) =>
  new Request("https://docs.recoupable.dev/mcp", { method, headers: accept ? { accept } : {} });

describe("isBrowserPageRequest", () => {
  it.each([
    ["a browser", "GET", "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"],
    ["a crawler", "HEAD", "text/html"],
    ["curl", "GET", "*/*"],
    ["a markdown reader", "GET", "text/markdown"],
    ["a request without Accept", "GET", undefined],
  ])("sends %s to the guide", (_, method, accept) => {
    expect(isBrowserPageRequest(request(method, accept))).toBe(true);
  });

  it.each([
    ["an MCP stream", "GET", "text/event-stream"],
    ["an MCP message", "POST", "application/json, text/event-stream"],
    ["a session close", "DELETE", "*/*"],
  ])("leaves %s to the MCP endpoint", (_, method, accept) => {
    expect(isBrowserPageRequest(request(method, accept))).toBe(false);
  });
});
