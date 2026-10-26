import { readFile } from "node:fs/promises";
import path from "node:path";

/** The Recoup mark (app/icon.svg) as a data URI, for share images and generated icons. */
export async function recoupMarkDataUri(): Promise<string> {
  const svg = await readFile(path.join(process.cwd(), "app/icon.svg"));
  return `data:image/svg+xml;base64,${svg.toString("base64")}`;
}
