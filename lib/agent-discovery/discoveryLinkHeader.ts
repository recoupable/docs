/** The site-wide Link header: every agent discovery file, with the relation names Mintlify used. */
export const discoveryLinkHeader = [
  '</llms.txt>; rel="describedby"; type="text/plain"',
  '</llms.txt>; rel="llms-txt"',
  '</llms-full.txt>; rel="llms-full-txt"',
  '</.well-known/mcp/server-card.json>; rel="mcp-server-card"',
  '</.well-known/agent-card.json>; rel="agent-card"',
  '</.well-known/agent-skills/index.json>; rel="agent-skills"',
].join(", ");
