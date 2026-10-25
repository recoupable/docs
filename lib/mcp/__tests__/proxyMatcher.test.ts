import { describe, expect, it } from "vitest";
import { config } from "@/proxy";

const matches = (path: string) => new RegExp(`^${config.matcher}$`).test(path);

describe("proxy matcher", () => {
  it("leaves the MCP endpoint to its route handler", () => {
    expect(matches("/mcp")).toBe(false);
    expect(matches("/mcp/")).toBe(false);
  });

  it("still negotiates documentation pages, including ones that start with mcp", () => {
    expect(matches("/quickstart")).toBe(true);
    expect(matches("/mcp-oauth")).toBe(true);
  });
});
