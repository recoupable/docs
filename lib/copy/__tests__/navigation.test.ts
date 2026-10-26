import { describe, expect, it } from "vitest";
import { headerNavigation } from "../navigation";
import { getStartedCopy } from "../get-started";

describe("cross-site navigation", () => {
  it("keeps only Docs on this host, with marketing destinations absolute", () => {
    const links = headerNavigation.flatMap<{ label: string; href: string }>(item => "href" in item ? [item] : [...item.links]);
    for (const link of links) {
      if (link.label === "Docs") expect(link.href).toBe("/");
      else expect(new URL(link.href).origin).toBe("https://recoupable.dev");
    }
    expect(new URL(getStartedCopy.build.href).origin).toBe("https://recoupable.dev");
  });
});
