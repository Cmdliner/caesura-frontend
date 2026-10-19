import type { ReactNode } from "react";

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  /** `dark` is for use on dark or brand-coloured backgrounds. */
  tone?: "light" | "dark";
  className?: string;
}

/** The one heading block used at the top of every homepage section. */
export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  tone = "light",
  className = "",
}: SectionHeadingProps) {
  const dark = tone === "dark";
  return (
    <div className={`${align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-2xl"} ${className}`}>
      {eyebrow && (
        <p className={`eyebrow mb-3 ${dark ? "!text-brand-400" : ""}`}>{eyebrow}</p>
      )}
      <h2 className={`text-4xl font-bold tracking-tight md:text-5xl ${dark ? "text-white" : "text-zinc-950"}`}>
        {title}
      </h2>
      {description && (
        <p className={`mt-4 text-lg leading-relaxed ${dark ? "text-zinc-300" : "text-zinc-600"}`}>{description}</p>
      )}
    </div>
  );
}
