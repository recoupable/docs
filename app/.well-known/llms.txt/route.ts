import { llmsIndexText } from "@/lib/agent-discovery/llmsIndexText";
import { discoveryHeaders } from "@/lib/agent-discovery/discoveryHeaders";
import { discoveryOptions } from "@/lib/agent-discovery/discoveryOptions";

export const dynamic = "force-static";

/** The same index as /llms.txt, at the well-known path Mintlify also served. */
export async function GET() {
  return new Response(await llmsIndexText(), { headers: discoveryHeaders("text/plain; charset=utf-8") });
}

export const OPTIONS = discoveryOptions;
