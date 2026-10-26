import { execFileSync } from "node:child_process";
import type { DocPage } from "../docs.ts";
import { parseGitLastModified } from "./parseGitLastModified.ts";

const source = "content/docs/source";
let history: Map<string, string> | undefined;
const fileDates = () => {
  if (history) return history;
  try {
    history = parseGitLastModified(execFileSync("git", ["log", "--format=%cI", "--name-only", "--", source], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 }));
  } catch {
    history = new Map();
  }
  return history;
};

/** When a page's source last changed in git: its MDX file, or its OpenAPI spec when that is newer. Undefined without git history. */
export function pageLastModified(page: DocPage | undefined): string | undefined {
  if (!page) return undefined;
  const dates = [`${source}/${page.source}`, ...(page.api?.spec ? [`${source}/api-reference/openapi/${page.api.spec}`] : [])]
    .map(file => fileDates().get(file))
    .filter((date): date is string => Boolean(date));
  return dates.sort().at(-1);
}
