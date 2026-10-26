/** Newest commit date per file from `git log --format=%cI --name-only` output (newest commits first). */
export function parseGitLastModified(log: string): Map<string, string> {
  const dates = new Map<string, string>();
  let current = "";
  for (const line of log.split("\n").map(item => item.trim()).filter(Boolean)) {
    if (/^\d{4}-\d{2}-\d{2}T/.test(line)) current = new Date(line).toISOString();
    else if (current && !dates.has(line)) dates.set(line, current);
  }
  return dates;
}
