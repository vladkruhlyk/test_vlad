import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

export const alt = `${siteConfig.name} — compare financial products in Poland`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Default social card, generated at the edge. Specific pages can still set a
// custom image via metadata; this is the site-wide fallback.
export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#ffffff",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "#0F172A",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 34,
              fontWeight: 700,
            }}
          >
            F
          </div>
          <span style={{ fontSize: 34, fontWeight: 600, color: "#0F172A" }}>
            {siteConfig.name}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 64,
              fontWeight: 700,
              color: "#0F172A",
              lineHeight: 1.1,
              letterSpacing: -2,
              maxWidth: 900,
            }}
          >
            Compare financial products in Poland without the guesswork
          </div>
          <div style={{ marginTop: 24, fontSize: 30, color: "#475569" }}>
            Bank accounts · Cards · Insurance
          </div>
        </div>

        <div style={{ display: "flex", height: 10, width: "100%" }}>
          <div style={{ flex: 1, background: "#2563EB" }} />
          <div style={{ flex: 1, background: "#22C55E" }} />
          <div style={{ flex: 1, background: "#F59E0B" }} />
        </div>
      </div>
    ),
    size,
  );
}
