import { absoluteUrl } from "../seo/absoluteUrl.ts";
import { skillDescription } from "./skillDescription.ts";

/**
 * /.well-known/agent-card.json in the A2A 0.3 card format Mintlify served. It lists the maintained
 * skill only: the docs site exposes no A2A endpoint, so no transport or interface is advertised.
 */
export function agentCard(skill: string) {
  return {
    name: "Recoup",
    description: "Recoup developer documentation: guides, API reference and the maintained agent skill.",
    url: absoluteUrl("/"),
    version: "1.0.0",
    protocolVersion: "0.3",
    provider: { url: absoluteUrl("/"), organization: "Recoup" },
    documentationUrl: absoluteUrl("/"),
    capabilities: { streaming: false, pushNotifications: false },
    defaultInputModes: ["text/plain"],
    defaultOutputModes: ["text/plain"],
    skills: [{
      id: "recoup",
      name: "recoup",
      description: skillDescription(skill),
      tags: [],
      url: absoluteUrl("/.well-known/agent-skills/recoup/skill.md"),
    }],
  };
}
