import { readFileSync } from "node:fs";
import { expect, test } from "vitest";
const spec = JSON.parse(
  readFileSync(
    "content/docs/source/api-reference/openapi/players.json",
    "utf8",
  ),
);
test("pending capabilities do not change existing operation availability or create/update responses", () => {
  const schema = spec.components.schemas;
  expect(schema.PlayerCapabilitiesV1.properties.version.const).toBe(1);
  for (const field of [
    "premiumEligibility",
    "tokenStatus",
    "scopeStatus",
    "playbackSupport",
  ])
    expect(
      schema.PlayerCapabilitiesV1.properties.spotify.properties[field].const,
    ).toBe("unknown");
  expect(
    schema.PublicPlayerConfig.properties.capabilities["x-recoup-availability"],
  ).toBe("pending");
  expect(schema.PublicPlayerConfig.required).not.toContain("capabilities");
  expect(schema.PlayerResource.properties).not.toHaveProperty("capabilities");
  const get = spec.paths["/api/players/{id}"].get;
  expect(get.responses["200"].content["application/json"].schema.$ref).toBe(
    "#/components/schemas/PlayerReadResource",
  );
  for (const item of Object.values(spec.paths) as Record<
    string,
    { operationId?: string; "x-recoup-availability"?: string }
  >[])
    for (const operation of Object.values(item))
      if (operation.operationId)
        expect(operation["x-recoup-availability"]).toBeUndefined();
  expect(
    spec.paths["/api/players"].post.responses["201"].content["application/json"]
      .schema.$ref,
  ).toBe("#/components/schemas/PlayerResource");
  expect(
    spec.paths["/api/players/{id}"].patch.responses["200"].content[
      "application/json"
    ].schema.$ref,
  ).toBe("#/components/schemas/PlayerResource");
});
test("metadata GET never promises session creation and POST requires provider and parent", () => {
  const get = spec.paths["/api/players/public/{id}"].get.description;
  const post = spec.paths["/api/players/public/{id}/session"].post.description;
  expect(get).toContain("never creates");
  expect(get).toContain("provider is rejected");
  expect(post).toContain("requires provider and parent");
  expect(post).not.toContain("Without provider");
});
