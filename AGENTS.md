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
