import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { docs } from "@/lib/docs";
import { ogCard } from "@/lib/seo/ogCard";
import { ogCardText } from "@/lib/seo/ogCardText";
import { recoupMarkDataUri } from "@/lib/seo/recoupMarkDataUri";

type Props = { params: Promise<{ slug?: string[] }> };
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return [{ slug: [] }, { slug: ["api-reference"] }, ...docs.filter(page => page.slug).map(page => ({ slug: page.slug.split("/") }))];
}

/** A docs page's 1200x630 share image, prerendered for every page. */
export async function GET(_request: Request, { params }: Props) {
  const { slug = [] } = await params;
  const key = slug.join("/");
  const page = docs.find(item => item.slug === key);
  if (!page && key !== "api-reference") return new Response("Not found", { status: 404 });
  const [sans, mono] = await Promise.all([
    readFile(path.join(process.cwd(), "node_modules/next/dist/compiled/@vercel/og/Geist-Regular.ttf")),
    readFile(path.join(process.cwd(), "node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff")),
  ]);
  return new ImageResponse(ogCard({ ...ogCardText(page, key), mark: await recoupMarkDataUri() }), {
    width: 1200,
    height: 630,
    fonts: [
      { name: "Geist", data: sans, weight: 400, style: "normal" },
      { name: "IBM Plex Mono", data: mono, weight: 400, style: "normal" },
    ],
  });
}
