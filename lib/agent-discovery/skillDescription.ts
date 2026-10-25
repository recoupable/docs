/** The one-line `description` from the maintained skill.md frontmatter. */
export function skillDescription(skill: string): string {
  const description = skill.match(/^---\n[\s\S]*?^description: (.+)$/m)?.[1];
  if (!description) throw new Error("skill.md frontmatter needs a one-line description");
  return description;
}
