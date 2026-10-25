import { readPublishedText } from "@/lib/docs/readPublishedText";
import { discoveryHeaders } from "@/lib/agent-discovery/discoveryHeaders";
import { discoveryOptions } from "@/lib/agent-discovery/discoveryOptions";

export const dynamic = "force-static";

/** The maintained agent index, served verbatim as Mintlify served it. */
export async function GET() {
  return new Response(await readPublishedText("llms.txt"), { headers: discoveryHeaders("text/plain; charset=utf-8") });
}

export const OPTIONS = discoveryOptions;
