/** Read only three pure modules at the exact pending API head; no application imports or I/O. */
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import vm from "node:vm";
import ts from "typescript";

const head = "7815162a62218142408663b2043ee32df656acbe";
const apiIndex = process.argv.indexOf("--api");
if (apiIndex < 0 || !process.argv[apiIndex + 1]) throw new Error("Provide --api with the exact reviewed API checkout");
const api = path.resolve(process.argv[apiIndex + 1]);
const git = (...args) => execFileSync("git", ["-C", api, ...args], { encoding: "utf8" });
if (git("rev-parse", "HEAD").trim() !== head) throw new Error("Pending API head differs from reviewed binding");
const files = [
  "lib/context/ContextIngestFailure.ts",
  "lib/context/classifyContextIngestFailure.ts",
  "lib/context/describeContextIngestFailure.ts",
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
const { ContextIngestFailure } = load(files[0]);
const { classifyContextIngestFailure } = load(files[1]);
const { describeContextIngestFailure } = load(files[2]);
const sourceFile = ts.createSourceFile(files[0], sources[files[0]], ts.ScriptTarget.Latest, true);
const alias = sourceFile.statements.find(node => ts.isTypeAliasDeclaration(node) && node.name.text === "ContextIngestFailureCode");
if (!alias || !ts.isUnionTypeNode(alias.type)) throw new Error("Expected literal failure-code union");
const codes = alias.type.types.map(node => {
  if (!ts.isLiteralTypeNode(node) || !ts.isStringLiteral(node.literal)) throw new Error("Nonliteral failure code");
  return node.literal.text;
});
const record = {
  availability: "pending",
  apiSourceCommit: head,
  evidence: "Exact three-module pure failure formatter source only; no handlers, provider imports, requests or database operations.",
  sourceHashes: Object.fromEntries(files.map(file => [file, createHash("sha256").update(sources[file]).digest("hex")])),
  failures: codes.map(code => ({code, text:describeContextIngestFailure(new ContextIngestFailure(code,"synthetic private diagnostic"))})),
  classificationExamples: ["Context storage operation failed: Recording mismatch", "Context storage operation failed: Worker no longer owns request", "Access denied to context owner", "private Conflicting artist identity suffix"].map(message => ({input:message, code:classifyContextIngestFailure(new Error(message))})),
};
const output = path.join(process.cwd(), "content/docs/contracts/context-ingest-recovery-pending.json");
const serialized = JSON.stringify(record, null, 2) + "\n";
if (process.argv.includes("--write")) writeFileSync(output, serialized);
else if (readFileSync(output, "utf8") !== serialized) throw new Error("Pending recovery contract differs from exact API source");
console.log(`Verified ${record.failures.length} failure texts against ${head}`);
