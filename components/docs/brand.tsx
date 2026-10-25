import Image from "next/image";
import Link from "next/link";

/** The Recoupable wordmark and "Docs", linking home. Dark mode inverts the black wordmark in CSS. */
export function Brand() {
  return (
    <Link href="/" className="docs-brand" aria-label="Recoup docs home">
      <Image src="/logo/light.svg" alt="" width={112} height={30} priority unoptimized />
      <span>Docs</span>
    </Link>
  );
}
