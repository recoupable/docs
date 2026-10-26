const LIMIT = 160;
const MINIMUM = 80;

const plain = (markdown: string) => markdown.split(/\n\s*\n/)[0]
  .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
  .replace(/(\*\*|__)(.+?)\1/g, "$2")
  .replace(/`([^`]*)`/g, "$1")
  .replace(/<[^>]+>/g, "")
  .replace(/\s+/g, " ")
  .trim();

const truncate = (text: string) => `${text.slice(0, LIMIT - 1).replace(/\s+\S*$/, "").replace(/[\s,;:.]+$/, "")}…`;

/** Whole opening sentences within the limit; a cut at a word boundary when they would say too little. */
const lead = (text: string) => {
  let result = "";
  for (const sentence of text.split(/(?<=[.!?])\s+(?=[A-Z(])/)) {
    const next = result ? `${result} ${sentence}` : sentence;
    if (next.length > LIMIT) break;
    result = next;
  }
  return result.length >= MINIMUM || result.length === text.length ? result : truncate(text);
};

/**
 * An API page's description: the opening of the operation's description (the text Mintlify used),
 * within 160 characters, or the summary when that says as much.
 */
export function operationDescription(operation: { summary?: string; description?: string } | undefined): string {
  const summary = operation?.summary?.trim() ?? "";
  const opening = lead(plain(operation?.description ?? ""));
  return opening.length > summary.length ? opening : summary;
}
