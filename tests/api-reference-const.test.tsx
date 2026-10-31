import { createElement, type ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync } from 'node:fs';
import { expect, it, vi } from 'vitest';
import { ApiReference } from '@/components/docs/api-reference';
import { getDocSpec, type ApiObject } from '@/lib/docs-server';
import type { DocPage } from '@/lib/docs';

vi.mock('@/lib/docs-server', async importOriginal => ({
  ...await importOriginal<typeof import('@/lib/docs-server')>(),
  getDocSpec: vi.fn(),
}));
// Exclude raw operation/example code so assertions prove the schema presentation.
vi.mock('@/components/docs/docs-interactive', () => ({ DocsCode: () => null }));
vi.mock('@/components/docs/playground/api-playground', () => ({ ApiPlayground: () => null }));
vi.mock('@/components/docs/hash-target-opener', () => ({ HashTargetOpener: () => null }));
vi.mock('@/components/docs/docs-content', () => ({
  DocDescription: ({text}: {text?: string}) => createElement('p', null, text),
  DocInlineDescription: ({text}: {text?: ReactNode}) => text,
}));
const spec = JSON.parse(readFileSync('content/docs/source/api-reference/openapi/content.json','utf8'));
async function render(schemaSpec: ApiObject, path: string) {
  vi.mocked(getDocSpec).mockResolvedValue(schemaSpec);
  return renderToStaticMarkup(await ApiReference({page:{api:{spec:'content.json',method:'GET',path}} as DocPage}));
}
it.each(['/api/content/packs/{id}', '/api/content/packs/{id}/export'])('renders fixed accounting values in the actual %s schema', async path => {
  const html = await render(spec,path);
  for (const value of ['customer_charge','no_additional_customer_charge','not_measured','not_budgeted']) {
    expect(html).toContain(`Fixed value: <code>&quot;${value}&quot;</code>`);
  }
  expect(html).toContain('string · const');
});
it('renders falsy, root and parameter constants while retaining enum/default presentation', async () => {
  const schema = {type:'object',properties:{flag:{type:'boolean',const:false},zero:{type:'number',const:0},nil:{type:'null',const:null},choice:{type:'string',enum:['a','b'],default:'a'}},allOf:[{const:false}]};
  const operation = {parameters:[{name:'fixed',in:'query',schema:{type:'number',const:0}}],responses:{200:{description:'Fixture',content:{'application/json':{schema}}}}};
  const fixture = {paths:{'/fixture':{get:operation}}};
  const html=await render(fixture,'/fixture');
  for (const value of ['false','0','null']) expect(html).toContain(`Fixed value: <code>${value}</code>`);
  expect(html.match(/Fixed value: <code>false<\/code>/g)).toHaveLength(2);
  expect(html.match(/Fixed value: <code>0<\/code>/g)).toHaveLength(2);
  expect(html).toContain('Values: &quot;a&quot;, &quot;b&quot;');
  expect(html).toContain('Default: <code>&quot;a&quot;</code>');
});
