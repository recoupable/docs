import { siteConfig } from "@/lib/config";

/** Mintlify's footer: the social links from the legacy docs.json. */
export function SiteFooter() {
  return (
    <footer className="docs-site-footer">
      <nav aria-label="Social">
        {siteConfig.socials.map((social) => (
          <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer">{social.label}</a>
        ))}
      </nav>
    </footer>
  );
}
