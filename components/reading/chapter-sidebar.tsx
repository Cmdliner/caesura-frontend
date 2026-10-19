"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

export interface ChapterListItem {
  id: string;
  chapter_number: number;
  title?: string;
  word_count?: number;
}

/**
 * The list of chapters. Used inside the slide-in drawer (small screens) and the fixed rail (desktop).
 * Colours come from the --reader-* variables set by the reader so it follows the chosen theme.
 */
export function ChapterList({
  chapters,
  currentChapter,
  onSelect,
}: {
  chapters: ChapterListItem[];
  currentChapter: number;
  onSelect: (chapterNumber: number) => void;
}) {
  const activeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "center" });
  }, [currentChapter]);

  return (
    <nav className="space-y-0.5 px-2 py-2" aria-label="Chapters">
      {chapters.map((ch) => {
        const active = ch.chapter_number === currentChapter;
        return (
          <button
            key={ch.id}
            ref={active ? activeRef : undefined}
            type="button"
            onClick={() => onSelect(ch.chapter_number)}
            aria-current={active ? "true" : undefined}
            className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
              active ? "bg-[color:var(--reader-panel)]" : "hover:bg-[color:var(--reader-panel)]"
            }`}
          >
            <span
              className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-[11px] font-bold tabular-nums transition-colors ${
                active ? "bg-brand-600 text-white" : "bg-[color:var(--reader-panel)] text-[color:var(--reader-muted)] group-hover:bg-[color:var(--reader-line)]"
              }`}
            >
              {ch.chapter_number}
            </span>
            <span className="min-w-0 flex-1">
              <span className={`block truncate text-[13px] leading-tight ${active ? "font-bold" : "font-semibold"} text-[color:var(--reader-fg)]`}>
                {ch.title || `Chapter ${ch.chapter_number}`}
              </span>
              {ch.word_count ? (
                <span className="mt-0.5 block text-[11px] text-[color:var(--reader-muted)]">{ch.word_count.toLocaleString()} words</span>
              ) : null}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

interface ChapterSidebarProps {
  chapters: ChapterListItem[];
  currentChapter: number;
  onChapterSelect: (chapterNumber: number) => void;
  isOpen: boolean;
  onClose: () => void;
  bookTitle: string;
}

/** Slide-in contents drawer for screens that don't have the desktop rail. */
export default function ChapterSidebar({ chapters, currentChapter, onChapterSelect, isOpen, onClose, bookTitle }: ChapterSidebarProps) {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [isOpen, onClose]);

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-zinc-950/50 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        aria-label="Chapter list"
        className={`fixed bottom-0 left-0 top-0 z-50 flex w-[min(88vw,22rem)] flex-col bg-[color:var(--reader-bg)] shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-shrink-0 items-start justify-between gap-3 border-b border-[color:var(--reader-line)] px-5 pb-4 pt-5">
          <div className="min-w-0">
            <p className="mb-1 text-[11px] font-bold uppercase tracking-widest text-[color:var(--reader-accent)]">Contents</p>
            <h2 className="line-clamp-2 text-[15px] font-bold leading-snug text-[color:var(--reader-fg)]">{bookTitle}</h2>
            <p className="mt-1 text-xs text-[color:var(--reader-muted)]">
              {chapters.length} {chapters.length === 1 ? "chapter" : "chapters"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close contents"
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[color:var(--reader-panel)] text-[color:var(--reader-fg)] transition-colors hover:bg-[color:var(--reader-line)]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <ChapterList
            chapters={chapters}
            currentChapter={currentChapter}
            onSelect={(n) => {
              onChapterSelect(n);
              onClose();
            }}
          />
        </div>
      </aside>
    </>
  );
}
