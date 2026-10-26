import Link from "next/link";
import { PageMark } from "./page-mark";

/** Recoup Sky lockup; currentColor follows the active docs theme. */
export function Brand() {
  return (
    <Link href="/" className="docs-brand" aria-label="Recoup docs home">
      <PageMark />
      <span className="docs-brand-wordmark">Recoup</span>
      <span className="docs-brand-label">Docs</span>
    </Link>
  );
}
