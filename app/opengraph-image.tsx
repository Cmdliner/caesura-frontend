import { ImageResponse } from "next/og";

// Image shown when a Caesura link is shared (Slack, X, WhatsApp, iMessage...).
export const alt = "Caesura: read and share stories";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 96px",
          background: "#09090b",
          color: "#ffffff",
          position: "relative",
        }}
      >
        {/* brand splash, bottom right */}
        <div style={{ position: "absolute", right: -120, bottom: -140, width: 520, height: 520, borderRadius: 9999, background: "#ea580c" }} />
        <div style={{ position: "absolute", right: 300, bottom: 70, width: 56, height: 56, borderRadius: 9999, background: "#ea580c" }} />
        <div style={{ position: "absolute", right: 380, bottom: 150, width: 24, height: 24, borderRadius: 9999, background: "#fb923c" }} />

        <div style={{ display: "flex", alignItems: "center" }}>
          <svg width="150" height="150" viewBox="0 0 64 64">
            <rect width="64" height="64" rx="15" fill="#18181b" stroke="#3f3f46" strokeWidth="1" />
            <path d="M41.5 22.4A15 15 0 1 0 41.5 41.6" fill="none" stroke="#ea580c" strokeWidth="7" strokeLinecap="round" />
            <circle cx="49.5" cy="43" r="4.5" fill="#ffffff" />
          </svg>
          <div style={{ display: "flex", fontSize: 128, fontWeight: 900, marginLeft: 36, letterSpacing: -3 }}>Caesura</div>
        </div>

        <div style={{ display: "flex", fontSize: 44, color: "#d4d4d8", marginTop: 36, maxWidth: 720, lineHeight: 1.25 }}>
          Original stories from emerging writers. Read, write and share.
        </div>
      </div>
    ),
    { ...size }
  );
}
