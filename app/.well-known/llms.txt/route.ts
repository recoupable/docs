import { readPublishedText } from "@/lib/docs/readPublishedText";
import { discoveryHeaders } from "@/lib/agent-discovery/discoveryHeaders";
import { discoveryOptions } from "@/lib/agent-discovery/discoveryOptions";

export const dynamic = "force-static";

/** The same maintained index as /llms.txt, at the well-known path Mintlify also served. */
export async function GET() {
  return new Response(await readPublishedText("llms.txt"), { headers: discoveryHeaders("text/plain; charset=utf-8") });
}

export const OPTIONS = discoveryOptions;
