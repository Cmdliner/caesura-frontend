/**
 * Wavy section edge. Place inside a `relative overflow-hidden` section and colour it with the
 * background of the NEIGHBOURING section (via text-*), so that section appears to flow into
 * this one:
 *
 *   <section className="relative bg-zinc-950 ...">
 *     <WaveDivider position="top" className="text-brand-50" />      // previous section's colour
 *     ...
 *     <WaveDivider position="bottom" className="text-zinc-50" />    // next section's colour
 *   </section>
 *
 * The section needs extra top/bottom padding so content clears the wave.
 */

const W = 1440;
const H = 120;

/** A smooth sine edge as an SVG path, filled from the top of the box down to the curve. */
function wavePath(amplitude: number, waves: number, phase: number): string {
  const steps = 160;
  const mid = H / 2;
  let d = `M0,0 L0,${(mid + amplitude * Math.sin(phase)).toFixed(2)}`;
  for (let i = 1; i <= steps; i++) {
    const x = (i / steps) * W;
    const y = mid + amplitude * Math.sin((i / steps) * waves * 2 * Math.PI + phase);
    d += ` L${x.toFixed(2)},${y.toFixed(2)}`;
  }
  return `${d} L${W},0 Z`;
}

// Different curves so a top and a bottom divider on the same section don't look copy-pasted.
const VARIANTS = {
  a: wavePath(34, 2, 0),
  b: wavePath(30, 1.5, Math.PI * 0.9),
} as const;

interface WaveDividerProps {
  position: "top" | "bottom";
  variant?: keyof typeof VARIANTS;
  className?: string;
}

export default function WaveDivider({ position, variant = "a", className = "" }: WaveDividerProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      fill="currentColor"
      className={`pointer-events-none absolute inset-x-0 z-[1] h-12 w-full sm:h-16 md:h-24 ${
        position === "top" ? "-top-px" : "-bottom-px"
      } ${className}`}
      // The path fills from the top edge; flipping it gives the bottom version.
      style={position === "bottom" ? { transform: "scaleY(-1)" } : undefined}
    >
      <path d={VARIANTS[variant]} />
    </svg>
  );
}
