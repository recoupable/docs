import { robotsText } from "@/lib/agent-discovery/robotsText";

export const dynamic = "force-static";

/** Plain text rather than app/robots.ts, which cannot emit the Content-Signal line. */
export function GET() {
  return new Response(robotsText(), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
