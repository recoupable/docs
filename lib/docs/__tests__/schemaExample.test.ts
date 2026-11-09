import { describe, expect, it } from "vitest";
import { schemaExample } from "../schemaExample";

describe("OpenAPI request examples", () => {
  it("combines required fields from composed request schemas and keeps the first alternative", () => {
    const spec = { components: { schemas: {
      Artist: { type: "object", required: ["artist_id"], properties: { artist_id: { type: "string", format: "uuid" }, note: { type: "string" } } },
    } } };
    const schema = { allOf: [
      { $ref: "#/components/schemas/Artist" },
      { oneOf: [
        { type: "object", properties: { action: { enum: ["claim"] }, enabled: { type: "boolean", default: false } } },
        { type: "object", properties: { action: { enum: ["release"] } } },
      ] },
    ] };
    expect(schemaExample(schema, spec)).toEqual({ artist_id: "YOUR_ID", action: "claim", enabled: false });
  });

  it.each([null, false, 0, ""])("does not replace an explicit %j example with a default", (example) => {
    expect(schemaExample({ example, default: "fallback" }, {})).toBe(example);
  });

  it("produces a serializable example for a recursive schema without recursing forever", () => {
    const node = { type: "object", required: ["label", "child"], properties: { label: { example: "node" }, child: { $ref: "#/components/schemas/Node" } } };
    const spec = { components: { schemas: { Node: node } } };
    const example = schemaExample({ $ref: "#/components/schemas/Node" }, spec);
    expect(example).toMatchObject({ label: "node", child: { label: "node" } });
    expect(() => JSON.stringify(example)).not.toThrow();
  });
});
