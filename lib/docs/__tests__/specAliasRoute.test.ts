import { describe, expect, it } from "vitest";
import { GET as getAlias } from "@/app/api-reference/openapi/[name]/route";
import { GET as getSpec } from "@/app/spec/[name]/route";

const params = (name: string) => ({ params: Promise.resolve({ name }) });

describe("/api-reference/openapi/<name>.json", () => {
  it("serves the same specification as /spec/<name>.json, inline as Mintlify does", async () => {
    const alias = await getAlias(new Request("https://docs.recoupable.dev/api-reference/openapi/research.json"), params("research.json"));
    const spec = await getSpec(new Request("https://docs.recoupable.dev/spec/research.json"), params("research.json"));
    expect(alias.status).toBe(200);
    expect(alias.headers.get("content-type")).toBe("application/json; charset=utf-8");
    expect(alias.headers.get("content-disposition")).toBe("inline");
    expect(await alias.json()).toEqual(await spec.json());
  });

  it("returns 404 for an unknown specification", async () => {
    const response = await getAlias(new Request("https://docs.recoupable.dev/api-reference/openapi/nope.json"), params("nope.json"));
    expect(response.status).toBe(404);
  });
});
