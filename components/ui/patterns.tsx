/**
 * Decorative brand patterns. Everything here is flat vector (no blur, no glow)
 * and inherits colour from `currentColor`, so tint it with a text-* class:
 *
 *   <Splash variant="a" className="-right-20 -top-24 h-96 w-96 text-brand-500" />
 *
 * Always place inside a `relative overflow-hidden` parent.
 */

type SplashProps = {
  variant?: "a" | "b" | "c";
  className?: string;
};

const BLOB_A =
  "M214 18c31 4 47 33 72 46 29 15 66 9 85 35 20 27 4 64 11 94 7 31 32 53 22 82-10 31-48 36-71 57-22 20-27 58-56 68-30 10-60-12-91-12-32 0-66 17-92-1-27-19-17-58-33-84-15-25-52-36-53-66-1-31 33-49 47-76 13-25 5-61 28-79 25-19 60-2 92-8 15-3 27-59 39-56Z";

const BLOB_B =
  "M30 210c-6-34 18-52 44-62 24-9 36-34 62-50 28-17 66-8 96-2 28 6 48 28 78 28 32 0 63-14 88 6 26 20 18 58 10 90-8 31-30 52-58 66-29 14-62 2-93 12-30 10-52 38-84 34-31-4-42-38-66-58-25-20-71-18-77-64Z";

export function Splash({ variant = "a", className = "" }: SplashProps) {
  const base = `pointer-events-none absolute select-none ${className}`;

  if (variant === "a") {
    return (
      <svg viewBox="0 0 400 400" fill="currentColor" aria-hidden="true" className={base}>
        <path d={BLOB_A} />
        <circle cx="368" cy="48" r="16" />
        <circle cx="392" cy="96" r="8" />
        <circle cx="38" cy="352" r="20" />
        <circle cx="12" cy="302" r="8" />
        <circle cx="330" cy="388" r="10" />
        <circle cx="64" cy="40" r="6" />
      </svg>
    );
  }

  if (variant === "b") {
    return (
      <svg viewBox="0 0 400 300" fill="currentColor" aria-hidden="true" className={base}>
        <path d={BLOB_B} />
        <circle cx="372" cy="40" r="14" />
        <circle cx="30" cy="40" r="10" />
        <circle cx="388" cy="270" r="9" />
        <circle cx="20" cy="268" r="16" />
        <circle cx="200" cy="288" r="6" />
      </svg>
    );
  }

  // c: loose droplets only, for subtle accents
  return (
    <svg viewBox="0 0 200 200" fill="currentColor" aria-hidden="true" className={base}>
      <circle cx="40" cy="48" r="22" />
      <circle cx="104" cy="22" r="9" />
      <circle cx="150" cy="70" r="14" />
      <circle cx="176" cy="132" r="7" />
      <circle cx="96" cy="120" r="30" />
      <circle cx="40" cy="170" r="10" />
      <circle cx="140" cy="182" r="5" />
    </svg>
  );
}

/** Flat dotted texture. `className` sets position, size and colour (text-*). */
export function DotPattern({ className = "" }: { className?: string }) {
  return <div aria-hidden="true" className={`pattern-dots pointer-events-none absolute ${className}`} />;
}
