import { docs } from "../docs.ts";
import { docsLlmsLinks } from "../docs/docsLlmsLinks.ts";
import { readPublishedText } from "../docs/readPublishedText.ts";

/** The hand-maintained llms.txt introduction followed by a generated link to every page. */
export async function llmsIndexText(): Promise<string> {
  return `${(await readPublishedText("llms.txt")).trimEnd()}\n\n${docsLlmsLinks(docs)}\n`;
}
