import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { docs } from '@/lib/docs';
import { docsLlmsLinks } from '@/lib/docs/docsLlmsLinks';
import { DocsSidebar } from '@/components/docs/docs-interactive';

vi.mock('next/navigation', () => ({ usePathname: () => '/sdks' }));

describe('documentation navigation', () => {
  it('renders short navigation labels while keeping descriptive page titles searchable', () => {
    const html = renderToStaticMarkup(createElement(DocsSidebar, { pages: docs }));
    const sdk = docs.find(page => page.slug === 'sdks')!;
    expect(sdk.title).toContain('Go and Python');
    expect(html).toContain('<span>SDKs</span>');
    expect(html).toContain('<span>Website API</span>');
    expect(html).toContain('<span>Introduction</span>');
    expect(html).not.toContain(sdk.title);
    expect(html).toContain('<span>Quickstart</span>');
    expect(html).toMatch(/<a(?=[^>]*href="\/sdks")(?=[^>]*aria-current="page")[^>]*>/);
    for (const page of docs) {
      expect(page.searchText).toContain(page.title);
      if (page.sidebarTitle) expect(page.searchText).toContain(page.sidebarTitle);
      expect(page.title).not.toMatch(/^api-reference\//);
    }
  });

  it('distinguishes destinations within each navigation group', () => {
    const seen = new Set<string>();
    for (const page of docs) {
      const key = `${page.category}/${page.group}/${page.sidebarTitle || page.title}`;
      expect(seen.has(key), `Ambiguous navigation label: ${key}`).toBe(false);
      seen.add(key);
    }
  });

  it('gives agents topic headings and full titles without dropping or duplicating pages', () => {
    const text = docsLlmsLinks(docs);
    expect(text).toContain('### Catalog\n');
    expect(text).toContain('#### Catalog songs\n');
    expect(text).toContain('#### Agent connections\n');
    expect(text).toContain('[Recoup SDKs: Go and Python clients for the music API]');
    expect(text.match(/^- \[/gm)).toHaveLength(docs.length);
    for (const page of docs) {
      expect(text.split(`/${page.slug || 'index'}.md)`).length - 1).toBe(1);
    }
  });
});
