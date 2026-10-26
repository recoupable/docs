type OgCardProps = { eyebrow: string; title: string; description: string; mark: string };

/** The 1200x630 share card: Recoup mark, section label, page title and description on black. */
export function ogCard({ eyebrow, title, description, mark }: OgCardProps) {
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "64px 88px", background: "#0a0a0a", color: "#fafafa", fontFamily: "Geist" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={mark} width={64} height={64} alt="" />
        <span style={{ fontSize: 30, letterSpacing: "-0.01em" }}>Recoup Docs</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <span style={{ fontFamily: "IBM Plex Mono", fontSize: 24, letterSpacing: "0.08em", color: "#a1a1a1" }}>{eyebrow}</span>
        <span style={{ fontSize: title.length > 40 ? 56 : title.length > 20 ? 64 : 80, lineHeight: 1.05, letterSpacing: "-0.02em" }}>{title}</span>
        {description ? <span style={{ fontSize: 28, lineHeight: 1.4, color: "#a1a1a1", maxWidth: 980 }}>{description}</span> : null}
      </div>
      <span style={{ fontFamily: "IBM Plex Mono", fontSize: 22, color: "#737373" }}>docs.recoupable.dev</span>
    </div>
  );
}
