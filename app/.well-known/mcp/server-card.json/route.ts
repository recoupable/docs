import { mcpServerCard } from "@/lib/agent-discovery/mcpServerCard";
import { discoveryHeaders } from "@/lib/agent-discovery/discoveryHeaders";
import { discoveryOptions } from "@/lib/agent-discovery/discoveryOptions";

export const dynamic = "force-static";

export function GET() {
  return Response.json(mcpServerCard(), { headers: discoveryHeaders("application/json") });
}

export const OPTIONS = discoveryOptions;
