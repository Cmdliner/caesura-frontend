import Link from "next/link";

/**
 * The Caesura mark: a C followed by a full stop. The dot is the pause (a caesura).
 * Same shapes as app/icon.svg; keep the two in sync.
 */
export function LogoMark({ className = "h-8 w-8", ring = false }: { className?: string; ring?: boolean }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className={`shrink-0 ${ring ? "rounded-[24%] ring-1 ring-white/25" : ""} ${className}`}>
      <rect width="64" height="64" rx="15" fill="#18181b" />
      <path d="M41.5 22.4A15 15 0 1 0 41.5 41.6" fill="none" stroke="#ea580c" strokeWidth="7" strokeLinecap="round" />
      <circle cx="49.5" cy="43" r="4.5" fill="#fff" />
    </svg>
  );
}

const sizes = {
  sm: { mark: "h-6 w-6", text: "text-2xl", gap: "gap-2" },
  md: { mark: "h-8 w-8", text: "text-3xl", gap: "gap-2.5" },
  lg: { mark: "h-10 w-10", text: "text-4xl", gap: "gap-3" },
  /** Auth pages: grows a step on larger screens. */
  xl: { mark: "h-10 w-10 sm:h-12 sm:w-12", text: "text-4xl sm:text-5xl", gap: "gap-2.5 sm:gap-3" },
} as const;

interface LogoProps {
  size?: keyof typeof sizes;
  /** `light` = white wordmark, for dark or photo backgrounds. */
  tone?: "dark" | "light";
  /** Link target; pass `null` to render without a link (e.g. in the design system page). */
  href?: string | null;
  onClick?: () => void;
  className?: string;
}

/** Mark + wordmark. Use this everywhere the brand appears instead of bare text. */
export default function Logo({ size = "md", tone = "dark", href = "/", onClick, className = "" }: LogoProps) {
  const s = sizes[size];
  const content = (
    <>
      <LogoMark className={s.mark} ring={tone === "light"} />
      <span className={`font-brand font-black leading-none transition-colors duration-200 ${s.text} ${tone === "light" ? "text-white" : "text-zinc-950"}`}>
        Caesura
      </span>
    </>
  );
  const base = `inline-flex shrink-0 items-center ${s.gap} ${className}`;

  return href === null ? (
    <span className={base}>{content}</span>
  ) : (
    <Link href={href} onClick={onClick} aria-label="Caesura home" className={base}>
      {content}
    </Link>
  );
}
