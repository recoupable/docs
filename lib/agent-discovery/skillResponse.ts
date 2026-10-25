import { readPublishedText } from "../docs/readPublishedText.ts";
import { discoveryHeaders } from "./discoveryHeaders.ts";

/** The maintained skill.md, served verbatim at each of its discovery paths. */
export async function skillResponse() {
  return new Response(await readPublishedText("skill.md"), { headers: discoveryHeaders("text/markdown; charset=utf-8") });
}
