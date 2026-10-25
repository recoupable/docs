import { createHash } from "node:crypto";
import { skillDescription } from "./skillDescription.ts";

/** /.well-known/agent-skills/index.json in the Agent Skills discovery 0.2.0 format. */
export function agentSkillsIndex(skill: string) {
  return {
    $schema: "https://schemas.agentskills.io/discovery/0.2.0/schema.json",
    skills: [{
      name: "recoup",
      type: "skill-md",
      description: skillDescription(skill),
      url: "/.well-known/agent-skills/recoup/skill.md",
      digest: `sha256:${createHash("sha256").update(skill).digest("hex")}`,
    }],
  };
}
