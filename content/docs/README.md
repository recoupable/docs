# Recoup documentation migration

This directory is the source of truth for docs.recoupable.dev. Documentation is authored under `source/`; the app reads no other checkout.

## Coverage

`inventory.json` records the current page and specification counts. Every authored
navigation page and every operation in the supplied OpenAPI specifications has a
content route. Operations without an authored navigation entry appear under
Additional endpoints. Markdown views expose the same page content and contracts.

The migration preserves source documentation; contract checks and recorded live evidence establish which behavior has been verified. Import scripts do not execute API requests. The request playground sends a request only when a reader supplies credentials and explicitly runs it.

## Edit and rebuild

Edit the MDX pages, `docs.json`, or the OpenAPI files under `source/`, then regenerate the derived files and commit them with the source change:

```bash
pnpm docs:build
```

`scripts/__tests__/build-docs.test.ts` rebuilds into a temporary directory and fails when `inventory.json`, `manifest.json`, or `navigation.json` differ from the committed files.

Validate route coverage, schema references, guide links, and generated request examples:

```bash
pnpm docs:check
```

The build compiles only allowlisted presentation components. It rejects imports, executable expressions, spread attributes, and unknown MDX components. Full source OpenAPI files stay intact; the UI adds grouped parameters, expandable nested schemas, response states, copyable requests, and specification downloads. The frontmatter method/path pointers are resolved against their named OpenAPI document; pointers without a file name are matched across the supplied documents.

## Routing and intentional adjustments

- `index.mdx` becomes `/`.
- Other navigation paths retain their original hierarchy at the site root.
- `/api-reference` is the complete endpoint index.
- `/spec/<name>.json` downloads the original specification.
- `/raw/<page>.md` provides readable Markdown and operation metadata.
- The outdated `sandboxes/file` guide link resolves to the documented `sandboxes/get-file` page.
- The old combined OpenAPI GitHub link now points to the API overview; each endpoint offers its current split specification.
- Cards use a separate title link so links inside their descriptions do not create invalid nested anchors.
- Documentation examples are displayed and copyable. The request playground lets readers run supported operations with their own credentials.
- The table of contents is collected from parsed document headings. Code examples cannot create phantom sections, and repeated heading names receive distinct anchors during compilation.

`inventory.json` records source counts, additional operations, and any unresolved pointers.

## Navigation labels

Use sentence case for titles and group names, retaining proper nouns and acronyms.
Endpoint titles should name the action and object; guide titles should name the topic.
Keep distinct routes distinguishable within a group. Keep availability and migration
qualifiers visible so a status guide does not look like a callable endpoint.

For a descriptive page title that is too long in the sidebar, add `sidebarTitle` to
its MDX frontmatter (for example, `sidebarTitle: "SDKs"`). The sidebar uses that label;
the page heading, search results, metadata, and Markdown keep the full `title`.
Both labels are indexed for search. Do not shorten API methods, paths, or operation IDs.

Group related pages in `source/docs.json`. The same categories and groups organize
the generated agent index at `/llms.txt`; `/llms-full.txt` retains every full page.
Regenerate and check the committed outputs after changing titles or navigation.

### Navigation audit — 2026-10-28

Audited all 243 navigation pages. Short labels, sentence case, smaller topic groups,
and a grouped agent index are implemented on `codex/docs-navigation-readability`.
All 144 tests, type checking, lint, and a production build passed on Node 24.
Local browser checks verified SDK search, desktop labels, and mobile navigation.
Page URLs and OpenAPI contracts are unchanged. Next: verify the hosted PR preview
and review before merging; production publication is not yet verified.
