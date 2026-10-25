import { getDocSpec } from "../docs-server.ts";
import inventory from "../../content/docs/inventory.json";

/** One published OpenAPI document as JSON; 404 for a name that is not in the inventory. */
export async function specResponse(name: string, disposition: string): Promise<Response> {
  if (!inventory.specifications.includes(name)) return new Response("Specification not found", { status: 404 });
  const spec = await getDocSpec(name);
  return new Response(JSON.stringify(spec, null, 2), {
    headers: { "Content-Type": "application/json; charset=utf-8", "Content-Disposition": disposition },
  });
}
