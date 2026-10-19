"use client";

type Variant = "pill" | "dots" | "lines";

interface MenuButtonProps {
  onClick: () => void;
  expanded?: boolean;
  /** `light` = on a dark or photo background (e.g. the home hero). */
  tone?: "dark" | "light";
  variant?: Variant;
  className?: string;
}

/**
 * Opens the mobile menu. Three styles, all with a small hover/press micro-interaction:
 *  - pill  (default): "Menu" label + two offset bars that swap lengths on hover
 *  - dots: a 2x2 grid of dots that rounds into a square on hover
 *  - lines: two offset bars in a circle
 */
export default function MenuButton({ onClick, expanded = false, tone = "dark", variant = "pill", className = "" }: MenuButtonProps) {
  const light = tone === "light";
  const surface = light ? "bg-white/15 text-white hover:bg-white/25" : "bg-zinc-100 text-zinc-900 hover:bg-zinc-200";
  const bar = "block h-[2px] rounded-full bg-current transition-all duration-300 ease-out";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Open menu"
      aria-expanded={expanded}
      aria-haspopup="dialog"
      className={`group inline-flex items-center justify-center rounded-full backdrop-blur-md transition-colors duration-200 active:scale-95 ${surface} ${
        variant === "pill" ? "h-10 gap-2.5 pl-4 pr-3.5" : "h-10 w-10"
      } ${className}`}
    >
      {variant === "pill" && (
        <>
          <span className="text-sm font-semibold leading-none">Menu</span>
          <span className="flex w-[18px] flex-col items-end gap-[5px]" aria-hidden="true">
            <span className={`${bar} w-[18px] group-hover:w-[10px]`} />
            <span className={`${bar} w-[10px] group-hover:w-[18px]`} />
          </span>
        </>
      )}

      {variant === "dots" && (
        <span className="grid grid-cols-2 gap-[5px]" aria-hidden="true">
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className="h-[6px] w-[6px] rounded-full bg-current transition-all duration-300 group-hover:rounded-[2px]" />
          ))}
        </span>
      )}

      {variant === "lines" && (
        <span className="flex w-[18px] flex-col items-end gap-[5px]" aria-hidden="true">
          <span className={`${bar} w-[18px]`} />
          <span className={`${bar} w-[10px] group-hover:w-[18px]`} />
        </span>
      )}
    </button>
  );
}
