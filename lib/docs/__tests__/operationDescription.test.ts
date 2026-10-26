import { describe, expect, it } from "vitest";
import { operationDescription } from "@/lib/docs/operationDescription";
import { docs } from "@/lib/docs";

const stats = "The platform's own analytics for one post published with [Create Post](/api-reference/posts/create), read live. Currently LinkedIn company-page posts only; other platforms return `422`. Each call is a fresh read.";

describe("operationDescription", () => {
  it("uses the opening sentences of the operation description, as Mintlify did, instead of a short summary", () => {
    expect(operationDescription({ summary: "Get post stats", description: stats })).toBe(
      "The platform's own analytics for one post published with Create Post, read live. Currently LinkedIn company-page posts only; other platforms return 422.",
    );
  });

  it("keeps whole sentences up to 160 characters and strips Markdown but not identifiers", () => {
    expect(operationDescription({ summary: "Runs", description: "Lists background runs for the account. Newest first. Includes **status** and `run_id` for every run. Paginated by cursor, fifty runs per page, with the newest cursor returned in the next_cursor field of the response." }))
      .toBe("Lists background runs for the account. Newest first. Includes status and run_id for every run.");
  });

  it("runs a short opening sentence into the next one, cut at a word boundary, rather than stopping at three words", () => {
    const result = operationDescription({ summary: "Get tasks", description: `Retrieve scheduled tasks. Each task includes recent_runs (last 5 runs), upcoming (next scheduled run times) sourced directly from the Trigger.dev API, and owner_email when an account email exists.` });
    expect(result.startsWith("Retrieve scheduled tasks. Each task includes recent_runs")).toBe(true);
    expect(result.length).toBeLessThanOrEqual(160);
    expect(result.endsWith("…")).toBe(true);
  });

  it("cuts a single long sentence at a word boundary", () => {
    const result = operationDescription({ summary: "x", description: `${"word ".repeat(60)}end.` });
    expect(result.length).toBeLessThanOrEqual(160);
    expect(result.endsWith("…")).toBe(true);
    expect(result).not.toMatch(/\s…$/);
  });

  it("keeps the summary when the operation has no longer description", () => {
    expect(operationDescription({ summary: "Delete a task permanently", description: "Delete." })).toBe("Delete a task permanently");
    expect(operationDescription({ summary: "Get runs" })).toBe("Get runs");
    expect(operationDescription(undefined)).toBe("");
  });
});

describe("API reference page descriptions", () => {
  it("are never a bare restatement of the title when the specification says more", () => {
    const thin = docs.filter(page => page.api && (page.description.length < 40 || page.description.replace(/\.$/, "").toLowerCase() === page.title.toLowerCase()));
    expect(thin.map(page => page.slug)).toEqual(expect.not.arrayContaining(["api-reference/publishing/stats"]));
    expect(docs.find(page => page.slug === "api-reference/publishing/stats")?.description).toMatch(/^The platform's own analytics for one post/);
  });
});
