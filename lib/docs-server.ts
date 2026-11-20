import { readFile } from 'node:fs/promises';
import { cache } from 'react';
import path from 'node:path';

import type { ApiObject } from "./docs/apiObject.ts";

export const getDocSpec = cache(async (name: string): Promise<ApiObject> => {
 if(!/^[a-z-]+\.json$/.test(name))throw new Error('Invalid specification name');
 return JSON.parse(await readFile(path.join(process.cwd(),'content/docs/source/api-reference/openapi',name),'utf8'));
});
