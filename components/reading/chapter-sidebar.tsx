"use client";

import { useEffect, useRef } from "react";

interface ChapterListItem {
  id: string;
  chapter_number: number;
  title?: string;
  word_count?: number;
}

interface ChapterSidebarProps {
  chapters: ChapterListItem[];
  currentChapter: number;
  onChapterSelect: (chapterNumber: number) => void;
  isOpen: boolean;
  onClose: () => void;
  bookTitle: string;
}

export default function ChapterSidebar({
  chapters,
  currentChapter,
  onChapterSelect,
  isOpen,
  onClose,
  bookTitle,
}: ChapterSidebarProps) {
  const activeRef = useRef<HTMLButtonElement>(null);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  // Scroll active chapter into view when sidebar opens
  useEffect(() => {
    if (isOpen && activeRef.current) {
      setTimeout(() => activeRef.current?.scrollIntoView({ block: "center", behavior: "smooth" }), 150);
    }
  }, [isOpen, currentChapter]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <aside
        className={`fixed left-0 top-0 bottom-0 z-50 w-[300px] sm:w-[320px] bg-white flex flex-col shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Chapter list"
      >
        {/* Header */}
        <div className="flex-shrink-0 px-5 pt-5 pb-4 border-b border-zinc-100">
          <div className="flex items-start justify-between gap-3 mb-1">
            <div className="min-w-0">
              <p className="text-[10.5px] font-bold uppercase tracking-widest text-zinc-400 mb-1">Contents</p>
              <h2 className="text-[14px] font-bold text-zinc-900 leading-snug line-clamp-2">{bookTitle}</h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer flex-shrink-0 h-8 w-8 rounded-xl flex items-center justify-center text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors mt-0.5"
              aria-label="Close sidebar"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-[11px] text-zinc-400">{chapters.length} {chapters.length === 1 ? "chapter" : "chapters"}</p>
        </div>

        {/* Chapter list */}
        <nav className="flex-1 overflow-y-auto py-2 px-2">
          {chapters.map((ch) => {
            const isActive = ch.chapter_number === currentChapter;
            return (
              <button
                key={ch.id}
                ref={isActive ? activeRef : undefined}
                type="button"
                onClick={() => { onChapterSelect(ch.chapter_number); onClose(); }}
                className={`cursor-pointer w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all mb-0.5 group ${
                  isActive
                    ? "bg-orange-50 border border-orange-100"
                    : "hover:bg-zinc-50 text-zinc-700 border border-transparent"
                }`}
              >
                {/* Number badge */}
                <span className={`flex-shrink-0 h-6 w-6 rounded-md flex items-center justify-center text-[11px] font-bold transition-colors ${
                  isActive
                    ? "bg-[#f97316] text-white"
                    : "bg-zinc-100 text-zinc-500 group-hover:bg-zinc-200"
                }`}>
                  {ch.chapter_number}
                </span>

                {/* Title */}
                <div className="flex-1 min-w-0">
                  {ch.title ? (
                    <>
                      <p className={`text-[13px] font-semibold truncate leading-tight ${isActive ? "text-zinc-900" : "text-zinc-900"}`}>
                        {ch.title}
                      </p>
                      <p className={`text-[11px] mt-0.5 ${isActive ? "text-[#f97316]" : "text-zinc-400"}`}>
                        Chapter {ch.chapter_number}
                        {ch.word_count ? ` · ${ch.word_count.toLocaleString()} words` : ""}
                      </p>
                    </>
                  ) : (
                    <p className={`text-[13px] font-semibold ${isActive ? "text-zinc-900" : "text-zinc-900"}`}>
                      Chapter {ch.chapter_number}
                      {ch.word_count ? (
                        <span className={`ml-1.5 text-[11px] font-normal ${isActive ? "text-[#f97316]" : "text-zinc-400"}`}>
                          · {ch.word_count.toLocaleString()} words
                        </span>
                      ) : null}
                    </p>
                  )}
                </div>

                {/* Reading indicator */}
                {isActive && (
                  <span className="flex-shrink-0 h-1.5 w-1.5 rounded-full bg-[#f97316]" />
                )}
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
