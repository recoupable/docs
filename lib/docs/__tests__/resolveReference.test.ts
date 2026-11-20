import { describe, expect, it } from "vitest";
import { resolveReference } from "../resolveReference";

describe("OpenAPI local references", () => {
  it("resolves escaped pointer names and retains use-site descriptions without mutating the source", () => {
    const shared = { type: "string", description: "Shared description", maxLength: 50 };
    const spec = { components: { schemas: { "artist/name~label": shared } } };
    const reference = { $ref: "#/components/schemas/artist~1name~0label", description: "Name used on this request" };
    expect(resolveReference(reference, spec)).toEqual({ type: "string", description: "Name used on this request", maxLength: 50 });
    expect(shared.description).toBe("Shared description");
    expect(reference.$ref).toBe("#/components/schemas/artist~1name~0label");
  });

  it.each(["#/components/schemas/Missing", "https://example.com/schema.json#/Artist"])("leaves unresolved reference %s visible", ($ref) => {
    const reference = { $ref, description: "Unresolved schema" };
    expect(resolveReference(reference, {})).toEqual(reference);
  });
});
