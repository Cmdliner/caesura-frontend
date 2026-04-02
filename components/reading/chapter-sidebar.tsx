"use client";

import { useEffect } from "react";

interface ChapterListItem {
  id: string;
  chapter_number: number;
  title?: string;
  published_at?: string;
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
  // Close sidebar on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-16 bottom-0 z-35 w-80 bg-white border-r border-zinc-200 overflow-y-auto transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="sticky top-0 bg-white border-b border-zinc-200 px-6 py-4 flex items-center justify-between">
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-zinc-600 truncate">
              {bookTitle}
            </h2>
            <p className="text-xs text-zinc-500">{chapters.length} chapters</p>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden flex-shrink-0 p-1 rounded hover:bg-zinc-100"
            aria-label="Close sidebar"
          >
            <svg
              className="h-5 w-5 text-zinc-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Chapters List */}
        <nav className="px-2 py-4">
          {chapters.map((chapter) => (
            <button
              key={chapter.id}
              onClick={() => {
                onChapterSelect(chapter.chapter_number);
                onClose();
              }}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all mb-2 ${
                currentChapter === chapter.chapter_number
                  ? "bg-orange-50 border border-orange-200"
                  : "hover:bg-zinc-50 border border-transparent"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p
                    className={`text-sm font-medium truncate ${
                      currentChapter === chapter.chapter_number
                        ? "text-orange-600"
                        : "text-zinc-900"
                    }`}
                  >
                    Chapter {chapter.chapter_number}
                  </p>
                  {chapter.title && (
                    <p className="text-xs text-zinc-500 truncate mt-0.5 line-clamp-2">
                      {chapter.title}
                    </p>
                  )}
                  {chapter.published_at && (
                    <p className="text-[10px] text-zinc-400 mt-1">
                      {new Date(chapter.published_at).toLocaleDateString()}
                    </p>
                  )}
                </div>
                {currentChapter === chapter.chapter_number && (
                  <div className="flex-shrink-0 mt-1">
                    <svg
                      className="h-4 w-4 text-orange-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </button>
          ))}
        </nav>
      </aside>

      {/* Show on desktop */}
      <style>{`
        @media (min-width: 1024px) {
          aside {
            transform: translateX(0) !important;
          }
        }
      `}</style>
    </>
  );
}
