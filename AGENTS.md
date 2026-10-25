# AGENTS.md

Source for the Recoup developer documentation at https://docs.recoupable.dev. A standalone Next.js 16
site: Mintlify-format content rendered by our own engine (no Mintlify runtime). Tracking issue:
[recoupable/app#2352](https://github.com/recoupable/app/issues/2352).

## Layout

- `content/docs/source/` is the only authored input: `docs.json` (navigation, Mintlify schema), MDX
  pages, `api-reference/openapi/*.json` (one OpenAPI 3.1 file per domain), `llms.txt` (hand-maintained).
- `pnpm docs:build` compiles it into the committed `content/docs/{manifest,navigation,inventory}.json`
  and `content/docs/source/llms-full.txt`. Commit the regenerated files with the source change; the
  build-drift test fails otherwise.
- `content/docs/contracts/` pins the documented operations to an `recoupable/api` commit
  (`operation-inventory.json` → `apiSourceCommit`). An operation that is documented but not yet live
  carries `x-recoup-availability: pending` and says so in its description.
- Routes serve at the site root: `/<page>`, `/raw/<page>.md` (also `<page>.md` and
  `Accept: text/markdown`), `/spec/<name>.json`, `/llms.txt`, `/llms-full.txt`.

## Rules

- MDX may use only `Card`, `CardGroup`, `CodeGroup`, `Info`, `Note`, `Tip`, `Warning`; imports and JS
  expressions are rejected at build time.
- Documentation-driven development: the docs PR (OpenAPI operation + reference page) merges before the
  `api` PR that implements it.
- One exported function per file in `lib/`; tests live in `__tests__/` next to the code.
- PRs target `main`; verify on the Vercel preview (previews call the test API, production calls the
  production API; see `lib/config.ts`).

## Commands

```bash
pnpm install
pnpm dev            # local site
pnpm docs:build     # regenerate manifest/navigation/inventory/llms-full.txt
pnpm test && pnpm type-check && pnpm lint && pnpm build
python3 scripts/refresh-contract-inventory.py --api <api checkout at the pinned commit> --check
```

## Contract notes (carried over from Marketing)


- Source of truth: `content/docs/source` (MDX pages, `docs.json` navigation, `api-reference/openapi/*.json`). Edit there; the retired Mintlify repository (`recoupable/docs`) is not read.
- After editing, run `pnpm docs:build` and commit the generated `content/docs/inventory.json`, `manifest.json`, and `navigation.json` together with the source change. `scripts/__tests__/build-docs.test.ts` fails when they drift.
- `pnpm docs:check` validates route coverage, schema references, guide links, and request examples.
- `scripts/build_plan_balance_contract.py` freezes the public credits/subscription response examples and guide example through the existing `build-contract-examples.py --api /path/to/api` workflow. Run the API's `publishedPlanBalances.test.ts` with the coordinated fixture; builder/example parity does not verify a real payment or current commercial offer.
- `scripts/build_sites_lifecycle_contract.py` freezes the Sites guide's bounded lifecycle/error examples and route accounting through `build-contract-examples.py --api /path/to/api`. Run the API's `publishedSitesLifecycle.test.ts` with the shared fixture; synthetic validation/HTTP-adapter checks do not establish a real paid publish or account lifecycle.
- `scripts/build_agent_signup_metadata_contract.py` freezes the admin key-metadata route, examples and resolved response schemas through `build-contract-examples.py --api /path/to/api`; the shared record also hashes its retained availability guide. Run API `publishedAgentSignupMetadata.test.ts` with that fixture. Preserve the distinct retired `/api/admins/agent/signups` URL, admin access, no credentials, current-email selection, returned-key-record counts, UTC calendar periods and collection limits. Synthetic tests do not establish signup origin, unique agents, active keys, adoption or live data completeness.
- `scripts/build_content_callback_contract.py` freezes the internal callback request/examples and selected response schemas/examples/CORS headers through the same shared-fixture workflow. Run API `publishedContentCallback.test.ts` to check optional `results[].imageUrl` retention and the actual route/poster with synthetic thread/media leaves, including secret-before-parse, unconfigured 503, 400 paths, normal/skipped acknowledgements and MIME filename rules. Preserve existing video selection and terminal retry limits; no stable 500, browser-preflight or delivery guarantee is implied. Receiver support and mocked posting do not prove worker deployment or live image delivery.
- Every platform OpenAPI operation needs a unique, stable `operationId` and a description. Preserve published IDs when editing descriptions or schemas; `tests/platform-openapi.test.ts` checks coverage and collisions across the split specifications.
- Selected Research/Sessions failed-chat-read 500 responses share the existing example fixture; run API `publishedChatReadFailures.test.ts` after changing those contracts. API #1128/#1129 supersede the old POST resume behavior with admission rejection; retain explicit GET reconnect and its empty/terminal finish-only SSE. Synthetic checks do not prove client or hosted reconnect behavior.
- Chat admission 409/503 and the optional POST/GET `streamLifecycle` query declaration share the published fixture. Run API publishedChatReadFailures.test.ts and publishedChatLifecycle.test.ts plus the focused lifecycle producer tests. Only one exact opt-in preserves work on reader disconnect; absent, unknown, empty or repeated values retain legacy cancellation. Callers preserve rejected input for manual recovery; source tests do not verify the App journey or production.
- Selected Stop 200/502/503/504 schemas and the pending-start 503 example share that fixture. Run API `publishedChatStop.test.ts` and producer `scripts/test_chat_stop_contracts.py`; publish only after the matching server repair. Pending-start Stop keeps its reservation and does not report cancellation. This does not change POST admission or reader-disconnect behavior.
- Unimplemented operations withdrawn under Mono #327 stay out of the callable specs and generated endpoint discovery. Preserve their status/migration guides and the unfinished product decisions in `operation-dispositions.json`; `tests/unsupported-operation-discovery.test.ts` guards this boundary. Removing a reference does not deliver or cancel its underlying feature.
- Artist Profile and Projects error components come from the API-owned generated
  error schemas. Run `python3 scripts/build-contract-examples.py --api /path/to/api` to
  import them and refresh selected response fixtures; its `--check` mode is in CI.
  Follow `DOCUMENTATION-POLICY.md` for the pinned API/Marketing/Docs sequence.
  `scripts/build_response_contracts.py` owns component and status-specific reference
  imports; `scripts/resolve_response_schema.py` resolves the selected local schemas.


See `DOCUMENTATION-POLICY.md` for the pinned API/docs sequence.
