import { readFileSync } from "node:fs";
import { expect, test } from "vitest";
import binding from "../content/docs/contracts/context-ingest-recovery-pending.json";
const read = (path: string) => readFileSync(path,"utf8");
const pending = () => JSON.parse(read("content/docs/source/api-reference/openapi/context-ingest-recovery-pending.json"));

test("pending recovery texts match exact API source without adding a transport operation", () => {
  const spec = pending();
  expect(spec.paths).toEqual({});
  expect(spec.servers).toBeUndefined();
  expect(spec["x-recoup-availability"]).toBe("pending");
  expect(spec["x-recoup-api-source-commit"]).toBe(binding.apiSourceCommit);
  expect(spec.components.schemas.ContextIngestFailureText.oneOf).toEqual(binding.failures.map(item => ({type:"string",const:item.text,title:item.code})));
  expect(spec["x-recoup-failure-examples"]).toEqual(binding.failures);
  for (const item of binding.failures) {
    expect(item.text.startsWith(`${item.code}: `)).toBe(true);
    expect(item.text.length).toBeLessThanOrEqual(1000);
    expect(item.text).not.toMatch(/synthetic private|no longer serves|No record was created|no artist record was created|before any record was accepted/);
  }
});

test("current operation and global API pin remain distinct from pending background guidance", () => {
  const current=JSON.parse(read("content/docs/source/api-reference/openapi/context.json"));
  expect(current.paths["/api/context"].post["x-recoup-availability"]).not.toBe("pending");
  expect(current.paths["/api/context"].post.responses["409"].description).toContain("Operation failed");
  const inventory=JSON.parse(read("content/docs/contracts/operation-inventory.json"));
  expect(inventory.apiSourceCommit).toBe("f56b6ae184b85e97ca3b7f1692378fea7a0b222b");
  const page=read("content/docs/source/api-reference/context/operate.mdx");
  for(const text of ["Current saved failure text", "Pending Spotify recovery guidance", "request.error", "not a transport error envelope", "404/410", "false", "400", "ingest_release", "fingerprint", "YouTube", "No automatic", "never copied into the stored guidance"]) expect(page).toContain(text);
  expect(page).toContain(binding.apiSourceCommit);
  for(const item of binding.failures) expect(page).toContain(item.text);
});
