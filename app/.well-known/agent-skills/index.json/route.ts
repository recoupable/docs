import { readPublishedText } from "@/lib/docs/readPublishedText";
import { agentSkillsIndex } from "@/lib/agent-discovery/agentSkillsIndex";
import { discoveryHeaders } from "@/lib/agent-discovery/discoveryHeaders";
import { discoveryOptions } from "@/lib/agent-discovery/discoveryOptions";

export const dynamic = "force-static";

export async function GET() {
  return Response.json(agentSkillsIndex(await readPublishedText("skill.md")), { headers: discoveryHeaders("application/json") });
}

export const OPTIONS = discoveryOptions;
