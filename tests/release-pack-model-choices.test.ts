import { readFileSync } from "node:fs";
import { expect, test } from "vitest";
import { resolveReference } from "../lib/docs-server";

const spec = JSON.parse(readFileSync("content/docs/source/api-reference/openapi/content.json", "utf8"));
const modelTasks = ["image", "image_edit", "motion", "caption", "still_inspection", "video_inspection", "analysis"];

test.each([
  ["post", "/api/content/packs"],
  ["patch", "/api/content/packs/{id}"],
])("%s %s publishes optional model choices in its actual request brief", (method, path) => {
  const operation = spec.paths[path][method];
  const request = resolveReference(operation.requestBody.content["application/json"].schema, spec);
  const brief = resolveReference(request.properties.brief, spec);

  // Resolve the same request schema used by the reference, not job.brief in the response.
  expect(brief.properties).toHaveProperty("model_choices");
  expect(brief.required ?? []).not.toContain("model_choices");
  const choices = resolveReference(brief.properties.model_choices, spec);
  expect(choices.type).toBe("object");
  expect(choices.additionalProperties).toBe(false);
  expect(choices.required ?? []).toEqual([]);
  expect(Object.keys(choices.properties)).toEqual(modelTasks);
  for (const task of modelTasks) {
    expect(choices.properties[task]).toEqual({ type: "string", minLength: 1, maxLength: 200 });
  }
});

test.each([
  "/api/content/packs/{id}/estimate",
  "/api/content/packs/{id}/retry",
])("%s does not accept a replacement brief or model choices", path => {
  const request = resolveReference(spec.paths[path].post.requestBody.content["application/json"].schema, spec);
  expect(request.additionalProperties).toBe(false);
  expect(request.properties).not.toHaveProperty("brief");
  expect(request.properties).not.toHaveProperty("model_choices");
});
