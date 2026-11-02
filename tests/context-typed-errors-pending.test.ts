import { readFileSync } from "node:fs";
import { expect, test } from "vitest";
import binding from "../content/docs/contracts/context-typed-errors-pending.json";
const read = (file: string) => readFileSync(file, "utf8");
const current = JSON.parse(read("content/docs/source/api-reference/openapi/context.json"));
const pending = () => JSON.parse(read("content/docs/source/api-reference/openapi/context-errors-pending.json"));

test("pending errors add no callable operation and do not hide existing Context", () => {
  const spec = pending();
  expect(spec.paths).toEqual({});
  expect(spec.servers).toBeUndefined();
  expect(spec["x-recoup-availability"]).toBe("pending");
  expect(spec["x-recoup-api-source-commit"]).toBe(binding.apiSourceCommit);
  expect(current.paths["/api/context"].post["x-recoup-availability"]).not.toBe("pending");
  expect(current.paths["/api/context"].post.responses["409"].description).toContain("Operation failed");
});

test("every pending HTTP and MCP variant matches the exact pure API formatter output", () => {
  const spec = pending();
  expect(spec.components.schemas.ContextOperationError.oneOf).toHaveLength(binding.codes.length);
  for (const item of binding.codes) {
    const http = spec.components.schemas.ContextOperationError.oneOf.find((row: {properties:{code:{const:string}}}) => row.properties.code.const === item.code);
    const mcp = spec.components.schemas.ContextMcpOperationError.oneOf.find((row: {properties:{code:{const:string}}}) => row.properties.code.const === item.code);
    expect(http.required).toEqual(["error", "code", "retryable", "guidance"]);
    expect(http.properties.error.const).toBe(item.http.body.error);
    expect(http.properties.retryable.const).toBe(item.http.body.retryable);
    expect(http.examples).toEqual([item.http.body]);
    expect(mcp.required.toSorted()).toEqual(["success", "message", "code", "retryable", "guidance"].toSorted());
    expect(mcp.properties.success.const).toBe(false);
    expect(mcp.properties.message.const).toBe(item.mcp.body.message);
    expect(mcp.examples).toEqual([item.mcp.body]);
    const response = spec.components.responses[`ContextError${item.http.status}`];
    expect(response["x-recoup-availability"]).toBe("pending");
    expect(response["x-recoup-codes"]).toContain(item.code);
  }
  expect(spec["x-recoup-action-examples"]).toEqual(binding.actionExamples);
  expect(spec["x-recoup-classification-examples"]).toEqual(binding.classificationExamples);
});

test("published prose distinguishes current behavior, reserved budget, and conditional retries", () => {
  const page = read("content/docs/source/api-reference/context/operate.mdx");
  for (const text of ["Pending", "blanket 409", "400", "InvalidParams", "not a guarantee", "No spend path", "same idempotency key", "Partial", "never returned or logged"]) expect(page).toContain(text);
  expect(page).not.toContain("No paid work was started");
  for (const item of binding.actionExamples) {
    expect(item.mcp.isError).toBe(true);
    expect(item.mcp.body.guidance).toBe(item.http.body.guidance);
    expect(item.http.body.guidance.includes("idempotency")).toBe(["ingest", "attach_evidence", "save_catalog_case"].includes(item.action));
  }
});
