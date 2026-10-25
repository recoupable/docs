import type { ApiObject } from "../docs-server.ts";
import { anchorSlug } from "./anchorSlug.ts";

/**
 * Mintlify-compatible anchor for a schema property: the parent anchor plus the
 * property name, with `-one-of-0` when the property is nullable (Mintlify renders
 * `nullable` as a oneOf of the type and null) unless it already declares oneOf/anyOf.
 */
export function schemaAnchorId(parent: string, name: string, schema: ApiObject): string {
  const id = `${parent}-${anchorSlug(name)}`;
  return schema.nullable && !schema.oneOf && !schema.anyOf ? `${id}-one-of-0` : id;
}
