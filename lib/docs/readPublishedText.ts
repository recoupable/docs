import { readFile } from "node:fs/promises";
import path from "node:path";

/** A hand-maintained or generated text file published from content/docs/source (llms.txt, llms-full.txt, skill.md). */
export function readPublishedText(name: "llms.txt" | "llms-full.txt" | "skill.md"): Promise<string> {
  return readFile(path.join(process.cwd(), "content/docs/source", name), "utf8");
}
