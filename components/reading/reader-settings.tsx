"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Type } from "lucide-react";

export type ReaderTheme = "light" | "paper" | "dark";
export type ReaderSize = "sm" | "md" | "lg";

export const READER_THEMES: Record<ReaderTheme, { label: string; vars: Record<string, string>; swatch: string }> = {
  light: {
    label: "Light",
    swatch: "#ffffff",
    vars: { "--reader-bg": "#ffffff", "--reader-fg": "#18181b", "--reader-muted": "#71717a", "--reader-line": "#e4e4e7", "--reader-panel": "#fafafa", "--reader-accent": "#c2410c" },
  },
  paper: {
    label: "Paper",
    swatch: "#f6efe0",
    vars: { "--reader-bg": "#f6efe0", "--reader-fg": "#3a2e22", "--reader-muted": "#8a7a66", "--reader-line": "#e4d8c0", "--reader-panel": "#efe6d2", "--reader-accent": "#b45309" },
  },
  dark: {
    label: "Dark",
    swatch: "#0c0c0e",
    vars: { "--reader-bg": "#0c0c0e", "--reader-fg": "#e4e4e7", "--reader-muted": "#a1a1aa", "--reader-line": "#27272a", "--reader-panel": "#18181b", "--reader-accent": "#fb923c" },
  },
};

export const READER_SIZES: Record<ReaderSize, { label: string; value: string }> = {
  sm: { label: "Small", value: "1rem" },
  md: { label: "Medium", value: "1.125rem" },
  lg: { label: "Large", value: "1.3rem" },
};

const STORAGE_KEY = "caesura_reader_prefs";

/** Persisted reading preferences (theme + text size). Safe when storage is unavailable. */
export function useReaderPrefs() {
  const [theme, setTheme] = useState<ReaderTheme>("light");
  const [size, setSize] = useState<ReaderSize>("md");

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      if (saved.theme in READER_THEMES) setTheme(saved.theme);
      if (saved.size in READER_SIZES) setSize(saved.size);
    } catch {
      /* ignore */
    }
  }, []);

  const update = (next: { theme?: ReaderTheme; size?: ReaderSize }) => {
    const t = next.theme ?? theme;
    const s = next.size ?? size;
    setTheme(t);
    setSize(s);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ theme: t, size: s }));
    } catch {
      /* ignore */
    }
  };

  const style = {
    ...READER_THEMES[theme].vars,
    "--reader-size": READER_SIZES[size].value,
  } as React.CSSProperties;

  return { theme, size, setTheme: (t: ReaderTheme) => update({ theme: t }), setSize: (s: ReaderSize) => update({ size: s }), style };
}

interface ReaderSettingsProps {
  theme: ReaderTheme;
  size: ReaderSize;
  onTheme: (t: ReaderTheme) => void;
  onSize: (s: ReaderSize) => void;
}

/** "Aa" button with a small popover for text size and theme. */
export default function ReaderSettings({ theme, size, onTheme, onSize }: ReaderSettingsProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Reading settings"
        aria-expanded={open}
        className="flex h-9 w-9 items-center justify-center rounded-full text-[color:var(--reader-fg)] transition-colors hover:bg-[color:var(--reader-panel)]"
      >
        <Type className="h-[18px] w-[18px]" />
      </button>

      {open && (
        <div className="animate-fade-down absolute right-0 top-full z-50 mt-2 w-64 rounded-2xl border border-zinc-200 bg-white p-4 text-zinc-900 shadow-pop">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-zinc-500">Text size</p>
          <div className="mb-4 grid grid-cols-3 gap-1.5">
            {(Object.keys(READER_SIZES) as ReaderSize[]).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => onSize(s)}
                aria-pressed={size === s}
                className={`rounded-xl py-2 font-semibold transition-colors ${
                  size === s ? "bg-zinc-950 text-white" : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                } ${s === "sm" ? "text-xs" : s === "md" ? "text-sm" : "text-lg"}`}
              >
                Aa
              </button>
            ))}
          </div>

          <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-zinc-500">Theme</p>
          <div className="grid grid-cols-3 gap-1.5">
            {(Object.keys(READER_THEMES) as ReaderTheme[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => onTheme(t)}
                aria-pressed={theme === t}
                className="flex flex-col items-center gap-1.5 rounded-xl p-2 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
              >
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-300"
                  style={{ background: READER_THEMES[t].swatch }}
                >
                  {theme === t && <Check className="h-4 w-4" style={{ color: t === "dark" ? "#fb923c" : "#c2410c" }} />}
                </span>
                {READER_THEMES[t].label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
