import { ImageResponse } from "next/og";

// iOS "Add to Home Screen" icon. iOS rounds the corners itself, so this is a full-bleed square.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex" }}>
        <svg width="180" height="180" viewBox="0 0 64 64">
          <rect width="64" height="64" fill="#18181b" />
          <path d="M41.5 22.4A15 15 0 1 0 41.5 41.6" fill="none" stroke="#ea580c" strokeWidth="7" strokeLinecap="round" />
          <circle cx="49.5" cy="43" r="4.5" fill="#ffffff" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
