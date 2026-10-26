import { ImageResponse } from "next/og";
import { recoupMarkDataUri } from "@/lib/seo/recoupMarkDataUri";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** The 180x180 apple-touch-icon: the Recoup mark, full bleed (iOS rounds the corners). */
export default async function AppleIcon() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", background: "#087fc6" }}><img src={await recoupMarkDataUri()} width={180} height={180} alt="" /></div>,
    size,
  );
}
