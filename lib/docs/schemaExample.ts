import type { ApiObject } from "./apiObject.ts";
import { resolveReference } from "./resolveReference.ts";

export function schemaExample(schema:ApiObject,spec:ApiObject,depth=0):unknown {
 if(depth>5)return undefined;
 schema=resolveReference(schema,spec);
 if(schema.example!==undefined)return schema.example;
 if(schema.default!==undefined)return schema.default;
 if(schema.enum)return schema.enum[0];
 if(schema.oneOf||schema.anyOf)return schemaExample((schema.oneOf||schema.anyOf)[0],spec,depth+1);
 if(schema.allOf)return Object.assign({},...schema.allOf.map((item:ApiObject)=>schemaExample(item,spec,depth+1)));
 if(schema.type==='object'||schema.properties)return Object.fromEntries(Object.entries(schema.properties||{}).filter(([key])=>!schema.required||schema.required.includes(key)).map(([key,value])=>[key,schemaExample(value as ApiObject,spec,depth+1)]));
 if(schema.type==='array')return [schemaExample(schema.items||{},spec,depth+1)];
 if(schema.type==='boolean')return true;
 if(schema.type==='integer'||schema.type==='number')return schema.minimum??0;
 if(schema.format==='uuid')return 'YOUR_ID';
 return schema.type==='string'?'string':undefined;
}
