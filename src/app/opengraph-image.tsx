import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: 72,
          background:
            "linear-gradient(135deg, #071820 0%, #143447 55%, #2F6F7A 100%)",
          color: "#E8EEF2",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: 80,
            top: 80,
            width: 220,
            height: 220,
            borderRadius: 999,
            background: "rgba(196,120,74,0.35)",
          }}
        />
        <div style={{ fontSize: 72, letterSpacing: -1 }}>{siteConfig.name}</div>
        <div style={{ marginTop: 18, fontSize: 32, opacity: 0.88 }}>
          {siteConfig.tagline}
        </div>
      </div>
    ),
    size,
  );
}
