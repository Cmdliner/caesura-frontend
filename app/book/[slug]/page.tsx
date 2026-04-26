"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import ChapterSidebar from "@/components/reading/chapter-sidebar";
import TipTapRenderer from "@/components/reading/tiptap-renderer";
import { useBookQueries, useBookMutation } from "@/lib/api/queries";
import { useAuth } from "@/app/providers/auth-provider";
import { progressManager, getErrorMessage } from "@/lib/utils";
import { booksAPI } from "@/lib/api/books";

export default function BookReaderPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const { isAuthenticated } = useAuth();

  const [currentChapter, setCurrentChapter] = useState(1);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [progressLoaded, setProgressLoaded] = useState(false);

  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data: book, isLoading: bookLoading, error: bookError } = useBookQueries.useBook(slug);
  const { data: chapter, isLoading: chapterLoading } = useBookQueries.useChapter(
    book?.id || "",
    currentChapter
  );
  const { mutate: updateProgress } = useBookMutation.useUpdateProgress();

  useEffect(() => {
    if (!isAuthenticated && !bookLoading) router.push("/login");
  }, [isAuthenticated, bookLoading, router]);

  useEffect(() => {
    if (!isAuthenticated || !book?.id || progressLoaded) return;
    booksAPI.getProgress(book.id).then((saved) => {
      if (saved?.chapter_number && saved.chapter_number >= 1) {
        setCurrentChapter(saved.chapter_number);
      } else {
        const local = progressManager.getProgress(book.id);
        if (local?.chapter_number && local.chapter_number >= 1) {
          setCurrentChapter(local.chapter_number);
        }
      }
      setProgressLoaded(true);
    });
  }, [isAuthenticated, book?.id, progressLoaded]);

  // Reading progress tracking
  useEffect(() => {
    if (!book?.id || !chapter?.id) return;

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      setScrollProgress(progress);

      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
      scrollTimerRef.current = setTimeout(() => {
        const position = Math.floor(progress);
        progressManager.setProgress(book.id, chapter.id, chapter.chapter_number, position);
        updateProgress(
          { bookId: book.id, progress: { chapter_id: chapter.id, scroll_position: position } },
          { onError: (err) => console.error("Progress save failed:", getErrorMessage(err)) }
        );
      }, 1500);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
    };
  }, [book?.id, chapter?.id, chapter?.chapter_number, updateProgress]);

  const handleChapterChange = useCallback((num: number) => {
    setCurrentChapter(num);
    setScrollProgress(0);
    window.scrollTo({ top: 0 });
  }, []);

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (bookLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex h-9 w-9 animate-spin rounded-full border-[3px] border-zinc-200 border-t-zinc-700" />
          <p className="mt-4 text-sm text-zinc-400">Loading…</p>
        </div>
      </div>
    );
  }

  // ── Not found ────────────────────────────────────────────────────────────────
  if (bookError || !book) {
    return (
      <>
        <main className="min-h-screen bg-white flex items-center justify-center px-4">
          <div className="text-center max-w-sm">
            <div className="mx-auto mb-4 h-14 w-14 rounded-2xl bg-zinc-100 flex items-center justify-center">
              <svg className="h-7 w-7 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <p className="text-[15px] font-bold text-zinc-900">Book not found</p>
            <p className="mt-1 text-sm text-zinc-500">This book doesn&apos;t exist or has been removed.</p>
            <Link
              href="/library"
              className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 text-white text-sm font-semibold hover:bg-zinc-700 transition-colors"
            >
              ← Back to Library
            </Link>
          </div>
        </main>
      </>
    );
  }

  const totalChapters = book.chapters?.length ?? 0;
  const hasPrev = currentChapter > 1;
  const hasNext = currentChapter < totalChapters;

  return (
    <div className="min-h-screen bg-white">
      {/* Reading progress bar */}
      <div className="fixed top-0 left-0 right-0 z-[70] h-[3px] bg-zinc-100">
        <div
          className="h-full bg-[#f97316] transition-[width] duration-200 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Chapter sidebar */}
      <ChapterSidebar
        chapters={book.chapters || []}
        currentChapter={currentChapter}
        onChapterSelect={handleChapterChange}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        bookTitle={book.title}
      />

      {/* Reading toolbar — sits right at the top (no AppNav) */}
      <div className="fixed top-[3px] left-0 right-0 z-30 bg-white/98 backdrop-blur-sm border-b border-zinc-100 h-11">
        <div className="h-full max-w-[860px] mx-auto px-4 flex items-center gap-3">
          {/* Back link */}
          <Link
            href="/library"
            className="cursor-pointer flex-shrink-0 inline-flex items-center gap-1 text-[12px] font-semibold text-zinc-400 hover:text-zinc-700 transition-colors"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden sm:inline">Library</span>
          </Link>

          <span className="text-zinc-200 text-sm flex-shrink-0">|</span>

          {/* Book title */}
          <p className="flex-1 min-w-0 text-[12.5px] font-semibold text-zinc-600 truncate">
            {book.title}
          </p>

          {/* Chapter position */}
          {totalChapters > 0 && (
            <span className="flex-shrink-0 text-[11.5px] text-zinc-400 tabular-nums hidden sm:block">
              Ch {currentChapter} / {totalChapters}
            </span>
          )}

          {/* Contents toggle */}
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="cursor-pointer flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 text-[12px] font-semibold text-zinc-600 hover:bg-zinc-50 hover:border-zinc-300 active:scale-95 transition-all"
            aria-label="Open chapter list"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
            </svg>
            <span className="hidden sm:inline">Contents</span>
          </button>
        </div>
      </div>

      {/* Main reading area */}
      <main className="pt-[48px] pb-24 min-h-screen">
        <div className="max-w-[680px] mx-auto px-5 sm:px-8">

          {chapterLoading ? (
            <div className="flex items-center justify-center py-32">
              <div className="text-center">
                <div className="inline-flex h-8 w-8 animate-spin rounded-full border-[3px] border-zinc-100 border-t-zinc-500" />
                <p className="mt-4 text-sm text-zinc-400">Loading chapter…</p>
              </div>
            </div>
          ) : !chapter ? (
            <div className="rounded-2xl bg-red-50 border border-red-100 p-8 text-center">
              <p className="text-red-700 font-semibold text-sm">Failed to load chapter content</p>
            </div>
          ) : (
            <>
              {/* Chapter header */}
              <header className="mb-10 sm:mb-14">
                {/* Ornamental divider */}
                <div className="flex items-center gap-3 mb-8">
                  <div className="flex-1 h-px bg-zinc-100" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-300">
                    Chapter {chapter.chapter_number}
                  </span>
                  <div className="flex-1 h-px bg-zinc-100" />
                </div>

                {chapter.title && (
                  <h1 className="text-[28px] sm:text-[34px] font-extrabold text-zinc-900 leading-[1.2] tracking-tight text-center mb-4">
                    {chapter.title}
                  </h1>
                )}

                {chapter.published_at && (
                  <p className="text-center text-[12px] text-zinc-400">
                    {new Date(chapter.published_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                )}

                {chapter.word_count && (
                  <p className="text-center text-[11.5px] text-zinc-300 mt-1">
                    {chapter.word_count.toLocaleString()} words
                  </p>
                )}
              </header>

              {/* Body */}
              <TipTapRenderer
                contentHtml={chapter.content_html}
                content={chapter.content}
              />

              {/* Chapter navigation */}
              <nav className="mt-16 pt-10 border-t border-zinc-100">
                <div className="flex items-stretch gap-3">
                  <button
                    type="button"
                    onClick={() => hasPrev && handleChapterChange(currentChapter - 1)}
                    disabled={!hasPrev}
                    className="cursor-pointer flex-1 group flex flex-col items-start gap-1 px-5 py-4 rounded-2xl border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 disabled:opacity-30 disabled:cursor-not-allowed active:scale-[0.99] transition-all"
                  >
                    <span className="text-[10.5px] font-bold uppercase tracking-widest text-zinc-400 group-hover:text-zinc-600 transition-colors">
                      ← Previous
                    </span>
                    {hasPrev && book.chapters[currentChapter - 2] && (
                      <span className="text-[13px] font-semibold text-zinc-900 line-clamp-1">
                        {book.chapters[currentChapter - 2].title || `Chapter ${currentChapter - 1}`}
                      </span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => hasNext && handleChapterChange(currentChapter + 1)}
                    disabled={!hasNext}
                    className="cursor-pointer flex-1 group flex flex-col items-end gap-1 px-5 py-4 rounded-2xl border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 disabled:opacity-30 disabled:cursor-not-allowed active:scale-[0.99] transition-all text-right"
                  >
                    <span className="text-[10.5px] font-bold uppercase tracking-widest text-zinc-400 group-hover:text-zinc-600 transition-colors">
                      Next →
                    </span>
                    {hasNext && book.chapters[currentChapter] && (
                      <span className="text-[13px] font-semibold text-zinc-900 line-clamp-1">
                        {book.chapters[currentChapter].title || `Chapter ${currentChapter + 1}`}
                      </span>
                    )}
                  </button>
                </div>

                {/* Chapter indicator dots */}
                {totalChapters > 1 && totalChapters <= 20 && (
                  <div className="mt-6 flex items-center justify-center gap-1.5">
                    {book.chapters.map((ch) => (
                      <button
                        key={ch.id}
                        type="button"
                        onClick={() => handleChapterChange(ch.chapter_number)}
                        title={`Chapter ${ch.chapter_number}${ch.title ? `: ${ch.title}` : ""}`}
                        className={`cursor-pointer transition-all rounded-full ${
                          ch.chapter_number === currentChapter
                            ? "h-2 w-5 bg-[#f97316]"
                            : "h-2 w-2 bg-zinc-200 hover:bg-zinc-400"
                        }`}
                      />
                    ))}
                  </div>
                )}

                {/* Numeric indicator for long books */}
                {totalChapters > 20 && (
                  <p className="mt-5 text-center text-[12px] text-zinc-400 tabular-nums">
                    {currentChapter} of {totalChapters}
                  </p>
                )}
              </nav>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
