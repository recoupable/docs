import { skillDescription } from "./skillDescription.ts";

/** /.well-known/skills/index.json: the skill and the files under /.well-known/skills/recoup/. */
export function skillsIndex(skill: string) {
  return { skills: [{ name: "recoup", description: skillDescription(skill), files: ["SKILL.md"] }] };
}
