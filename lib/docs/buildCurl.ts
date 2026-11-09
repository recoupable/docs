import type { ApiObject } from "./apiObject.ts";
import { resolveReference } from "./resolveReference.ts";
import { schemaExample } from "./schemaExample.ts";

function shellQuote(value:string) { return `'${value.replace(/'/g, `'"'"'`)}'`; }
export function buildCurl({method,endpoint,spec,operation,pathItem={}}:{method:string;endpoint:string;spec:ApiObject;operation:ApiObject;pathItem?:ApiObject}):string {
 const parameters=[...(pathItem.parameters||[]),...(operation.parameters||[])].map(parameter=>resolveReference(parameter,spec));
 const base=(operation.servers||pathItem.servers||spec.servers)?.[0]?.url||'https://api.recoupable.dev';
 const route=endpoint.replace(/\{([^}]+)\}/g,(_match,name)=>`YOUR_${name.replace(/([a-z])([A-Z])/g,'$1_$2').toUpperCase()}`);
 const query=new URLSearchParams();
 for(const parameter of parameters.filter(parameter=>parameter.in==='query'&&parameter.required)) {
  const value=parameter.example??parameter.schema?.example??parameter.schema?.default??`YOUR_${parameter.name.toUpperCase()}`;
  query.append(parameter.name,typeof value==='object'?JSON.stringify(value):String(value));
 }
 const lines=[`curl --request ${method}`,`  --url ${shellQuote(base+route+(query.size?`?${query}`:''))}`];
 const security=operation.security??spec.security;
 const scheme=security?.length?spec.components?.securitySchemes?.[Object.keys(security[0])[0]]:undefined;
 if(security?.length!==0)lines.push(`  --header ${shellQuote(scheme?.scheme==='bearer'?'Authorization: Bearer YOUR_TOKEN':`${scheme?.name||'x-api-key'}: YOUR_API_KEY`)}`);
 for(const parameter of parameters.filter(parameter=>parameter.in==='header'&&parameter.required&&parameter.name!==scheme?.name&&parameter.name.toLowerCase()!=='x-api-key'))lines.push(`  --header ${shellQuote(`${parameter.name}: ${parameter.example??parameter.schema?.example??'YOUR_VALUE'}`)}`);
 const body=resolveReference(operation.requestBody,spec);
 const mediaType=body.content?.['application/json']?'application/json':Object.keys(body.content||{})[0];
 const media=body.content?.[mediaType];
 const schema=resolveReference(media?.schema,spec);
 const example=media?.example??(media?.examples?resolveReference(Object.values(media.examples)[0] as ApiObject,spec).value:undefined)??(media?.schema?schemaExample(media.schema,spec):undefined);
 if(mediaType==='multipart/form-data'||mediaType==='application/x-www-form-urlencoded') {
  for(const [name,raw] of Object.entries(schema.properties||{})) {
   if(schema.required&&!schema.required.includes(name))continue;
   const property=resolveReference(raw as ApiObject,spec);
   const value=property.format==='binary'||property.items?.format==='binary'?'@YOUR_FILE_PATH':(example as ApiObject)?.[name]??schemaExample(property,spec)??'YOUR_VALUE';
   lines.push(`  ${mediaType==='multipart/form-data'?'--form':'--data-urlencode'} ${shellQuote(`${name}=${typeof value==='object'?JSON.stringify(value):String(value)}`)}`);
  }
 } else if(mediaType) {
  lines.push(`  --header ${shellQuote(`Content-Type: ${mediaType}`)}`);
  if(example!==undefined)lines.push(`  --data ${shellQuote(typeof example==='string'?example:JSON.stringify(example,null,2))}`);
 }
 return lines.join(' \\\n');
}
