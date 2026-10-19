type Platform = "ios" | "android";

interface StoreBadgeProps {
  platform: Platform;
  /** Store listing URL. Empty = not published yet, so the badge shows "Coming soon". */
  href?: string;
  /** `light` for dark backgrounds. */
  tone?: "dark" | "light";
  className?: string;
}

function AppleMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor" aria-hidden="true">
      <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
    </svg>
  );
}

function PlayMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden="true">
      <path d="M3.6 1.8 13.4 12 3.6 22.2c-.3-.3-.4-.7-.4-1.2V3c0-.5.1-.9.4-1.2Z" fill="#00A0FF" />
      <path d="M3.6 1.8 16.7 9.1 13.4 12 3.6 1.8Z" fill="#00E676" />
      <path d="M3.6 22.2 16.7 14.9 13.4 12 3.6 22.2Z" fill="#FF3A44" />
      <path d="m16.7 9.1 4.3 2.4c.6.3.6 1 0 1.3l-4.3 2.4-3.3-3 3.3-3.1Z" fill="#FFD500" />
    </svg>
  );
}

/** App Store / Google Play style download button. */
export default function StoreBadge({ platform, href, tone = "dark", className = "" }: StoreBadgeProps) {
  const ios = platform === "ios";
  const live = Boolean(href);

  const base = `relative inline-flex min-w-[10.5rem] items-center gap-3 rounded-2xl px-5 py-3 text-left transition-all duration-200 ${
    tone === "dark"
      ? "bg-zinc-950 text-white"
      : "bg-white text-zinc-950"
  } ${live ? "hover:-translate-y-0.5 hover:shadow-pop" : "cursor-default opacity-90"} ${className}`;

  const content = (
    <>
      {ios ? <AppleMark /> : <PlayMark />}
      <span className="leading-none">
        <span className={`block text-[10px] font-medium uppercase tracking-wider ${tone === "dark" ? "text-zinc-400" : "text-zinc-500"}`}>
          {ios ? "Download on the" : "Get it on"}
        </span>
        <span className="mt-1 block text-lg font-semibold">{ios ? "App Store" : "Google Play"}</span>
      </span>
      {!live && (
        <span className="absolute -right-2 -top-2.5 rounded-full bg-brand-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
          Soon
        </span>
      )}
    </>
  );

  return live ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={base} aria-label={ios ? "Download on the App Store" : "Get it on Google Play"}>
      {content}
    </a>
  ) : (
    <span className={base} role="img" aria-label={ios ? "App Store: coming soon" : "Google Play: coming soon"}>
      {content}
    </span>
  );
}
