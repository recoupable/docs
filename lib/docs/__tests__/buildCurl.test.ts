import { describe, expect, it } from "vitest";
import contextSpec from "../../../content/docs/source/api-reference/openapi/context.json";
import { buildCurl } from "../buildCurl";

const guestClaim = contextSpec.paths["/api/context/guest/claim"].post;

function claimCurl(operation = guestClaim) {
  return buildCurl({ method: "POST", endpoint: "/api/context/guest/claim", spec: contextSpec, operation });
}

describe("curl security requirements", () => {
  it("renders both the guest cookie and bearer token required by the published claim operation", () => {
    const curl = claimCurl();
    expect(curl).toContain("--cookie 'recoup_context_guest=YOUR_API_KEY'");
    expect(curl).toContain("--header 'Authorization: Bearer YOUR_TOKEN'");
    expect(curl).toContain("--header 'Origin: YOUR_VALUE'");
    expect(curl).not.toContain("--header 'recoup_context_guest:");
    expect(curl).not.toContain("--header 'x-api-key:");
  });

  it("renders the published guest read as cookie-only authentication", () => {
    const curl = buildCurl({ method: "GET", endpoint: "/api/context/guest", spec: contextSpec, operation: contextSpec.paths["/api/context/guest"].get });
    expect(curl).toContain("--cookie 'recoup_context_guest=YOUR_API_KEY'");
    expect(curl).not.toContain("--header");
  });

  it("selects only the first OR alternative while retaining all of its required schemes", () => {
    const curl = claimCurl({ ...guestClaim, security: [...guestClaim.security].reverse() });
    expect(curl).toContain("--cookie 'recoup_context_guest=YOUR_API_KEY'");
    expect(curl).toContain("--header 'x-api-key: YOUR_API_KEY'");
    expect(curl).not.toContain("Authorization:");
  });

  it("keeps standalone API-key, bearer, implicit legacy auth and explicit public examples", () => {
    const render = (operation: object) => buildCurl({ method: "GET", endpoint: "/fixture", spec: contextSpec, operation });
    expect(render({ security: [{ ApiKey: [] }] })).toContain("--header 'x-api-key: YOUR_API_KEY'");
    expect(render({ security: [{ BearerAuth: [] }] })).toContain("--header 'Authorization: Bearer YOUR_TOKEN'");
    expect(buildCurl({ method: "GET", endpoint: "/fixture", spec: {}, operation: {} })).toContain("--header 'x-api-key: YOUR_API_KEY'");
    expect(render({ security: [] })).not.toContain("--header");
    expect(render({ security: [{}, { BearerAuth: [] }] })).not.toContain("--header");
  });

  it("places query keys in the URL, combines required cookies, and keeps shell arguments quoted", () => {
    const spec = {
      security: [{ queryKey: [], cookieA: [], cookieB: [], headerKey: [] }],
      components: { securitySchemes: {
        queryKey: { type: "apiKey", in: "query", name: "access key" },
        cookieA: { type: "apiKey", in: "cookie", name: "session" },
        cookieB: { type: "apiKey", in: "cookie", name: "tenant's-session" },
        headerKey: { type: "apiKey", in: "header", name: "x-custom-key" },
      } },
    };
    const operation = { parameters: [
      { in: "query", name: "q", required: true, example: "artist & song" },
      { in: "header", name: "X-CUSTOM-KEY", required: true },
    ] };
    const curl = buildCurl({ method: "GET", endpoint: "/fixture", spec, operation });
    expect(curl).toContain("?q=artist+%26+song&access+key=YOUR_API_KEY'");
    expect(curl).toContain("--cookie 'session=YOUR_API_KEY; tenant'\"'\"'s-session=YOUR_API_KEY'");
    expect(curl.match(/--cookie/g)).toHaveLength(1);
    expect(curl).toContain("--header 'x-custom-key: YOUR_API_KEY'");
    expect(curl).not.toContain("--header 'X-CUSTOM-KEY:");
    expect(curl).not.toContain("--header 'access key:");
  });
});
