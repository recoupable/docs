import { readFileSync } from "node:fs";
import { expect, test } from "vitest";

const spec = JSON.parse(readFileSync("content/docs/source/api-reference/openapi/content.json", "utf8"));

function responseComponents(schema: unknown, found = new Set<string>()): Set<string> {
  if (!schema || typeof schema !== "object") return found;
  for (const [key, value] of Object.entries(schema)) {
    if (key === "$ref" && typeof value === "string" && !found.has(value)) {
      found.add(value);
      responseComponents(spec.components.schemas[value.split("/").at(-1)!], found);
    } else responseComponents(value, found);
  }
  return found;
}

test("read, estimate, retry and export contracts expose the same accounting meaning", () => {
  for (const [path, method] of [
    ["/api/content/packs/{id}", "get"],
    ["/api/content/packs/{id}/estimate", "post"],
    ["/api/content/packs/{id}/retry", "post"],
    ["/api/content/packs/{id}/export", "get"],
  ]) {
    const schema = spec.paths[path][method].responses["200"].content["application/json"].schema;
    expect(responseComponents(schema), path).toContain("#/components/schemas/ReleasePackCostAccounting");
  }
  expect(spec.components.schemas.ReleasePackCostAccounting.properties.provider_cost_usd.type).toBe("null");
});
