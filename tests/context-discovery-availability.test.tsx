import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { DocDescription } from "../components/docs/docs-content";

const spec = JSON.parse(readFileSync("content/docs/source/api-reference/openapi/context.json", "utf8"));
const operation = spec.paths["/api/context"].post;

function tableRows(heading: string) {
  const html = renderToStaticMarkup(createElement(DocDescription, { text: operation.description }));
  const table = html.match(/<table>[\s\S]*?<\/table>/g)?.find((value) => value.includes(heading));
  expect(table).toBeDefined();
  return table!.match(/<tr>[\s\S]*?<\/tr>/g)!;
}

describe("Context discovery availability in the actual description component", () => {
  for (const heading of ["Standard MCP tool", "Response model"]) {
    it(`labels pending actions in the ${heading} table without relabeling current actions`, () => {
      const rows = tableRows(heading);
      const pending = rows.find((row) => row.includes("<code>prepare_catalog_audit</code>"));
      const current = rows.find((row) => row.includes("<code>read_catalog_case</code>"));
      expect(pending).toContain("Pending");
      expect(current).toBeDefined();
      expect(current).not.toContain("Pending");
      expect(rows.filter((row) => row.includes("Pending"))).toHaveLength(1);
    });
  }

  it("keeps pending preparation out of delegated OAuth discovery", () => {
    expect(tableRows("Delegated OAuth tool").join("")).not.toContain("prepare_catalog_audit");
  });
});
