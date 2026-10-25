import { readFile } from "node:fs/promises";
import path from "node:path";

/** A hand-maintained or generated text file published from content/docs/source (llms.txt, llms-full.txt). */
export function readPublishedText(name: "llms.txt" | "llms-full.txt"): Promise<string> {
  return readFile(path.join(process.cwd(), "content/docs/source", name), "utf8");
}
