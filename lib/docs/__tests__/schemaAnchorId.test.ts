import { describe, expect, it } from "vitest";
import { schemaAnchorId } from "@/lib/docs/schemaAnchorId";

describe("schemaAnchorId", () => {
  it("joins the parent anchor and the kebab-cased property name", () => {
    expect(schemaAnchorId("body", "profile_urls", { type: "object" })).toBe("body-profile-urls");
    expect(schemaAnchorId("response-runs-items", "status", { type: "string" })).toBe("response-runs-items-status");
  });

  it("adds Mintlify's one-of-0 suffix to nullable properties", () => {
    expect(schemaAnchorId("response-runs-items", "startedAt", { type: "string", nullable: true })).toBe("response-runs-items-started-at-one-of-0");
    expect(schemaAnchorId("response-runs-items", "payload", { nullable: true })).toBe("response-runs-items-payload-one-of-0");
  });

  it("leaves nullable properties that already declare oneOf unsuffixed", () => {
    expect(schemaAnchorId("response-runs-items", "output", { nullable: true, oneOf: [{ type: "string" }] })).toBe("response-runs-items-output");
  });
});
