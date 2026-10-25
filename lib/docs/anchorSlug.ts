/** Kebab-cases a parameter or property name the way Mintlify builds field anchors (startedAt → started-at). */
export function anchorSlug(name: string): string {
  return name
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
