/** The site path of a docs page's 1200x630 share image (app/og). */
export function ogImagePath(key: string): string {
  return key ? `/og/${key}` : "/og";
}
