import { describe, expect, it } from "vitest";
import { docsRoutes } from "@/lib/docs";
import { GET as getOgImage, generateStaticParams } from "@/app/og/[[...slug]]/route";
import appleIcon, { size as appleSize } from "@/app/apple-icon";

const pngSize = (bytes: Uint8Array) => {
  const view = new DataView(bytes.buffer, bytes.byteOffset);
  return { png: [...bytes.subarray(1, 4)].map(c => String.fromCharCode(c)).join(""), width: view.getUint32(16), height: view.getUint32(20) };
};

describe("share images", () => {
  it("prerenders one image per docs route", async () => {
    const params = await generateStaticParams();
    expect(params).toHaveLength(docsRoutes.length);
  });

  it("renders a 1200x630 PNG for an API page", async () => {
    const response = await getOgImage(new Request("http://x/og/api-reference/publishing/stats"), { params: Promise.resolve({ slug: ["api-reference", "publishing", "stats"] }) });
    expect(response.headers.get("content-type")).toBe("image/png");
    expect(pngSize(new Uint8Array(await response.arrayBuffer()))).toEqual({ png: "PNG", width: 1200, height: 630 });
  }, 30000);

  it("404s for an unknown page", async () => {
    const response = await getOgImage(new Request("http://x/og/nope"), { params: Promise.resolve({ slug: ["nope"] }) });
    expect(response.status).toBe(404);
  });

  it("renders a 180x180 apple touch icon", async () => {
    expect(appleSize).toEqual({ width: 180, height: 180 });
    expect(pngSize(new Uint8Array(await (await appleIcon()).arrayBuffer()))).toEqual({ png: "PNG", width: 180, height: 180 });
  }, 30000);
});
