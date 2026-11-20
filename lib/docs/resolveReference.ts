import type { ApiObject } from "./apiObject.ts";

export function resolveReference(value:ApiObject|undefined,spec:ApiObject):ApiObject {
 if(!value)return {};
 if(!value.$ref)return value;
 if(!value.$ref.startsWith('#/'))return value;
 let resolved:ApiObject=spec;
 for(const part of value.$ref.slice(2).split('/'))resolved=resolved?.[part.replace(/~1/g,'/').replace(/~0/g,'~')];
 return resolved ? {...resolved,...Object.fromEntries(Object.entries(value).filter(([key])=>key!=='$ref'))}:value;
}
