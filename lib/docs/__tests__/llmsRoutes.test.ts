import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { GET as getLlms } from "@/app/llms.txt/route";
import { GET as getLlmsFull } from "@/app/llms-full.txt/route";

const published = (name: string) => readFileSync(`content/docs/source/${name}`, "utf8");

describe("llms routes", () => {
  it("serves the maintained llms.txt verbatim, as Mintlify did", async () => {
    const response = await getLlms();
    expect(response.headers.get("content-type")).toBe("text/plain; charset=utf-8");
    expect(await response.text()).toBe(published("llms.txt"));
  });

  it("serves the generated llms-full.txt verbatim", async () => {
    expect(await (await getLlmsFull()).text()).toBe(published("llms-full.txt"));
  });
});
