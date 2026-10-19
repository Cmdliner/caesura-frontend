"use client";

import { ArrowUp } from "lucide-react";

/** Small pill that scrolls the page back to the top. */
export default function BackToTop() {
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3.5 py-2 text-xs font-medium text-zinc-300 transition-colors hover:border-white/40 hover:bg-white/5 hover:text-white"
    >
      Back to top
      <ArrowUp className="h-3.5 w-3.5" />
    </button>
  );
}
