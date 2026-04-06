"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import AppHeader from "@/components/layout/app-header";
import ChapterSidebar from "@/components/reading/chapter-sidebar";
import TipTapRenderer from "@/components/reading/tiptap-renderer";
import { useBookQueries, useAuthQuery, useBookMutation } from "@/lib/api/queries";
import { useAuth } from "@/app/providers/auth-provider";
import { formatLastRead, progressManager, getErrorMessage } from "@/lib/utils";
import Link from "next/link";

export default function BookReaderPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const { isAuthenticated } = useAuth();

  const [currentChapter, setCurrentChapter] = useState(1);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Queries - must be at top level
  const { data: book, isLoading: bookLoading, error: bookError } = useBookQueries.useBook(slug);

  // Load saved progress
  useEffect(() => {
    if (!isAuthenticated || !book) return;

    const saved = progressManager.getProgress(book.id);
    if (saved) {
      setCurrentChapter(parseInt(saved.chapter_id) || 1);
      setScrollProgress(saved.scroll_position || 0);
    }
  }, [isAuthenticated, book?.id]);
  const {
    data: chapter,
    isLoading: chapterLoading,
    error: chapterError,
  } = useBookQueries.useChapter(book?.id || "", currentChapter);
  const { mutate: updateProgress } = useBookMutation.useUpdateProgress();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !bookLoading) {
      router.push("/login");
    }
  }, [isAuthenticated, bookLoading, router]);

  // Handle scroll and save progress
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const scrollHeight = target.scrollHeight - target.clientHeight;
    const progress = scrollHeight > 0 ? (target.scrollTop / scrollHeight) * 100 : 0;
    setScrollProgress(progress);

    // Save progress locally
    if (book?.id && chapter?.id) {
      progressManager.setProgress(book.id, chapter.id, Math.floor(progress));

      // Save to API
      updateProgress(
        {
          bookId: book.id,
          progress: {
            chapter_id: chapter.id,
            scroll_position: Math.floor(progress),
          },
        },
        {
          onError: (error) => {
            console.error("Failed to save progress:", getErrorMessage(error));
          },
        }
      );
    }
  };

  if (bookLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex h-12 w-12 animate-spin rounded-full border 4 border-zinc-200 border-t-orange-500" />
          <p className="mt-4 text-zinc-600">Loading book...</p>
        </div>
      </div>
    );
  }

  if (bookError || !book) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="mb-4 text-lg font-semibold text-zinc-900">Book not found</p>
          <p className="mb-6 text-zinc-600">This book doesn't exist or has been removed.</p>
          <Link
            href="/library"
            className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 font-medium text-white transition-colors hover:bg-orange-600"
          >
            Back to Library
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* App Header */}
      <AppHeader />

      {/* Chapter Sidebar */}
      <ChapterSidebar
        chapters={book.chapters || []}
        currentChapter={currentChapter}
        onChapterSelect={(chapterNumber) => {
          setCurrentChapter(chapterNumber);
          setScrollProgress(0);
        }}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        bookTitle={book.title}
      />

      {/* Main Content Area */}
      <main className="pt-16 lg:ml-80 lg:pt-16">
        <div
          className="min-h-screen flex flex-col bg-white overflow-y-auto"
          onScroll={handleScroll}
        >
          {/* Reading Area */}
          <div className="flex-1 px-3 sm:px-4 md:px-6 py-6 sm:py-8 md:py-12">
            {chapterLoading ? (
              <div className="max-w-3xl mx-auto flex items-center justify-center py-12 sm:py-20">
                <div className="text-center">
                  <div className="inline-flex h-10 sm:h-12 w-10 sm:w-12 animate-spin rounded-full border-[3px] sm:border-4 border-zinc-200 border-t-orange-500" />
                  <p className="mt-3 sm:mt-4 text-sm sm:text-base text-zinc-600">Loading chapter...</p>
                </div>
              </div>
            ) : chapterError || !chapter ? (
              <div className="max-w-3xl mx-auto rounded-lg bg-red-50 p-4 sm:p-6 text-center">
                <p className="text-sm sm:text-base text-red-700 font-medium">Failed to load chapter content</p>
              </div>
            ) : (
              <>
                {/* Chapter Header */}
                <div className="max-w-3xl mx-auto mb-8 sm:mb-10 md:mb-12">
                  <div className="text-center mb-6 sm:mb-8">
                    <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-orange-500">
                      Chapter {chapter.chapter_number}
                    </p>
                    {chapter.title && (
                      <h1 className="mt-2 sm:mt-3 text-2xl sm:text-3xl md:text-4xl font-extrabold text-zinc-900 leading-tight">
                        {chapter.title}
                      </h1>
                    )}
                    {chapter.published_at && (
                      <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-zinc-500">
                        Published {new Date(chapter.published_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    )}
                  </div>

                  {/* Progress Bar */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1 bg-zinc-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-orange-500 transition-all duration-300"
                        style={{ width: `${scrollProgress}%` }}
                      />
                    </div>
                    <span className="text-[10px] sm:text-xs text-zinc-500 font-medium flex-shrink-0">
                      {Math.round(scrollProgress)}%
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="max-w-3xl mx-auto px-1">
                  <TipTapRenderer
                    contentHtml={chapter.content_html}
                    content={chapter.content}
                    title={undefined}
                  />
                </div>

                {/* Chapter Navigation */}
                <div className="max-w-3xl mx-auto mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-zinc-200">
                  <div className="flex items-center justify-between gap-2 sm:gap-4 px-1">
                    <button
                      onClick={() => {
                        if (currentChapter > 1) {
                          setCurrentChapter(currentChapter - 1);
                          setScrollProgress(0);
                          window.scrollTo(0, 0);
                        }
                      }}
                      disabled={currentChapter === 1}
                      className="flex-1 inline-flex items-center justify-center gap-1 sm:gap-2 rounded-lg border border-zinc-200 px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-300 hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                      <span className="hidden sm:inline">Previous</span>
                    </button>

                    <div className="relative flex-shrink-0">
                      <select
                        value={currentChapter}
                        onChange={(e) => {
                          setCurrentChapter(parseInt(e.target.value) || 1);
                          setScrollProgress(0);
                          window.scrollTo(0, 0);
                        }}
                        className="appearance-none px-2 sm:px-3 py-2 rounded-lg border border-zinc-200 bg-white text-xs sm:text-sm font-medium text-zinc-700 hover:border-zinc-300 focus:border-orange-400 focus:outline-none cursor-pointer pr-6 sm:pr-8"
                      >
                        {book.chapters.map((ch) => (
                          <option key={ch.id} value={ch.chapter_number}>
                            Ch. {ch.chapter_number}
                            {ch.title ? ` - ${ch.title}` : ""}
                          </option>
                        ))}
                      </select>
                      <svg
                        className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-700"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 14l-7 7m0 0l-7-7m7 7V3"
                        />
                      </svg>
                    </div>

                    <button
                      onClick={() => {
                        if (currentChapter < book.chapters.length) {
                          setCurrentChapter(currentChapter + 1);
                          setScrollProgress(0);
                          window.scrollTo(0, 0);
                        }
                      }}
                      disabled={currentChapter === book.chapters.length}
                      className="flex-1 inline-flex items-center justify-center gap-1 sm:gap-2 rounded-lg border border-zinc-200 px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-300 hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="hidden sm:inline">Next</span>
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer Spacing */}
          <div className="h-12" />
        </div>
      </main>

      {/* Keyboard shortcuts hint */}
      <div className="hidden fixed bottom-4 left-4 sm:block text-xs text-zinc-500">
        <kbd className="px-2 py-1 bg-zinc-100 rounded border border-zinc-300">Esc</kbd>
        {" "}to toggle sidebar
      </div>
    </div>
  );
}
