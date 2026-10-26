---
name: recoup
description: Use when calling the Recoup music-platform API, CLI or MCP server for artist research, content creation, chats, scheduled tasks, catalogs or account credits. Points to the maintained docs, specs and authentication rules.
---

# Recoup

Recoup is an AI agent platform for the music industry. The authenticated API lives at `https://api.recoupable.dev/api`; the documentation lives at `https://docs.recoupable.dev`.

## Read before calling

- [llms.txt](https://docs.recoupable.dev/llms.txt): the maintained index of guides and operations.
- [llms-full.txt](https://docs.recoupable.dev/llms-full.txt): every page as one text file.
- Any page as Markdown: append `.md` to its URL, or send `Accept: text/markdown`.
- OpenAPI 3.1 specifications, one per domain: `https://docs.recoupable.dev/spec/<name>.json` (`accounts`, `ai`, `applications`, `content`, `context`, `players`, `projects`, `releases`, `research`, `sandbox`, `sessions`, `social`, `templates`, `uploads`).
- Docs MCP server: `https://docs.recoupable.dev/mcp` with `search_docs` and `read_page`.

Each operation page states its authentication, availability and cost. Trust the page and its specification over this summary.

## Authentication

Send exactly one credential per request: `x-api-key: <key>`, or `Authorization: Bearer <token>`. Sending both returns `401`. See [Authentication](https://docs.recoupable.dev/authentication.md).

- Agents without a key: [Agent account access](https://docs.recoupable.dev/agents.md) covers verified email signup.
- AI hosts: connect `https://api.recoupable.dev/mcp` through [MCP OAuth](https://docs.recoupable.dev/mcp-oauth.md) with the user's real account.
- Terminal: the [CLI](https://docs.recoupable.dev/cli.md) reads `RECOUP_API_KEY`.

Keep credentials in environment variables or a secret store. Never print them.

## Common flows

- Artists: `GET /api/artists` lists the roster. Content calls take the artist's `account_id` as `artist_account_id`.
- Content: `POST /api/content/create` returns `runIds`. Poll each with `GET /api/tasks/runs` until it reaches a terminal status.
- Public uploads: `POST /api/upload` is pending coordinated release; one supported file up to 4 MiB, with a public URL. See [Public file upload](https://docs.recoupable.dev/api-reference/uploads/create.md). Do not substitute it for private Files or release-pack audio.
- Research: `GET /api/research/lookup`, `/profile`, `/metrics` and `/similar` read artist data; `POST /api/research/web` and `/extract` research the open web.
- Chats: `GET /api/chats` and `POST /api/chats`; see the Chat reference for streaming and stop.
- Credits: `GET /api/accounts/{id}/credits` and `GET /api/accounts/{id}/usage`. See [Credits](https://docs.recoupable.dev/credits.md) for what each call costs.

## Reusable skills

`npx skills add recoupable/skills` installs Recoup's maintained agent skills for these workflows.
