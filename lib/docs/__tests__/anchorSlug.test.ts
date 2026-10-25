import { describe, expect, it } from "vitest";
import { anchorSlug } from "@/lib/docs/anchorSlug";

describe("anchorSlug", () => {
  it("kebab-cases names the way Mintlify builds field anchors", () => {
    expect(anchorSlug("profile_urls")).toBe("profile-urls");
    expect(anchorSlug("startedAt")).toBe("started-at");
    expect(anchorSlug("baseCostInCents")).toBe("base-cost-in-cents");
    expect(anchorSlug("run_id")).toBe("run-id");
    expect(anchorSlug("x-api-key")).toBe("x-api-key");
  });
});
