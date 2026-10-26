import { readPublishedText } from "@/lib/docs/readPublishedText";
import { agentCard } from "@/lib/agent-discovery/agentCard";
import { discoveryHeaders } from "@/lib/agent-discovery/discoveryHeaders";
import { discoveryOptions } from "@/lib/agent-discovery/discoveryOptions";

export const dynamic = "force-static";

export async function GET() {
  return Response.json(agentCard(await readPublishedText("skill.md")), { headers: discoveryHeaders("application/json") });
}

export const OPTIONS = discoveryOptions;
