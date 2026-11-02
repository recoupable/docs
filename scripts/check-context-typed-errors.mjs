/** Read only six pure modules at the exact pending API head; no application imports or I/O. */
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import vm from "node:vm";
import ts from "typescript";

const head = "4aa6ee59822e9f6369d3fcacd90d71d97b7d7c56";
const apiIndex = process.argv.indexOf("--api");
if (apiIndex < 0 || !process.argv[apiIndex + 1]) throw new Error("Provide --api with the exact reviewed API checkout");
const api = path.resolve(process.argv[apiIndex + 1]);
const git = (...args) => execFileSync("git", ["-C", api, ...args], { encoding: "utf8" });
if (git("rev-parse", "HEAD").trim() !== head) throw new Error("Pending API head differs from reviewed binding");
const files = [
  "lib/context/ContextOperationError.ts",
  "lib/context/classifyContextOperationError.ts",
  "lib/context/formatContextOperationError.ts",
  "lib/context/getContextFailureMessage.ts",
  "lib/mcp/getCallToolResult.ts",
  "lib/mcp/tools/context/getContextToolResultError.ts",
];
const sources = Object.fromEntries(files.map(file => {
  const source = readFileSync(path.join(api, file), "utf8");
  if (source !== git("show", `${head}:${file}`)) throw new Error(`Dirty source: ${file}`);
  return [file, source];
}));
const cache = new Map();
function load(file) {
  if (cache.has(file)) return cache.get(file);
  if (!Object.hasOwn(sources, file)) throw new Error(`Module outside pure allowlist: ${file}`);
  const loadedModule = { exports: {} };
  const require = name => load((name.startsWith("@/") ? name.slice(2) : path.posix.join(path.posix.dirname(file), name)) + ".ts");
  const code = ts.transpileModule(sources[file], {compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
  vm.runInNewContext(code, { module: loadedModule, exports: loadedModule.exports, require, Error }, { filename: file, timeout: 1000 });
  cache.set(file, loadedModule.exports);
  return loadedModule.exports;
}
const { ContextOperationError, contextOperationErrorCodes } = load(files[0]);
const { classifyContextOperationError } = load(files[1]);
const { formatContextOperationError } = load(files[2]);
const { getContextToolResultError } = load(files[5]);
const pair = (code, action) => {
  const error = new ContextOperationError(code);
  const result = getContextToolResultError(error, action);
  return { code, ...(action ? {action} : {}), http: formatContextOperationError(error, action), mcp: {isError:result.isError, body:JSON.parse(result.content[0].text)} };
};
const record = {
  availability: "pending",
  apiSourceCommit: head,
  evidence: "Exact pure API source only; no application handlers, services, hosted calls, authentication or provider execution.",
  sourceHashes: Object.fromEntries(files.map(file => [file, createHash("sha256").update(sources[file]).digest("hex")])),
  codes: contextOperationErrorCodes.map(code => pair(code)),
  actionExamples: ["read", "plan", "verify_release", "ingest", "attach_evidence", "save_catalog_case"].map(action => pair("unavailable", action)),
  classificationExamples: ["Context request not found", "Access denied to context owner", "Context storage operation failed: query returned no rows", "Context storage operation failed: Catalog revision conflict", "private-record unavailable"].map(message => ({input:message, code:classifyContextOperationError(new Error(message)).code})),
};
const output = path.join(process.cwd(), "content/docs/contracts/context-typed-errors-pending.json");
const serialized = JSON.stringify(record, null, 2) + "\n";
if (process.argv.includes("--write")) writeFileSync(output, serialized);
else if (readFileSync(output, "utf8") !== serialized) throw new Error("Pending contract differs from exact API source");
console.log(`Verified ${record.codes.length} codes and ${record.actionExamples.length} action examples against ${head}`);
