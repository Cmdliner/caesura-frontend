"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ArrowLeft, ArrowRight, BookOpen, BookX, ChevronLeft, ChevronRight, List } from "lucide-react";
import AppNav from "@/components/layout/app-nav";
import EmptyState, { ErrorState, PageLoader } from "@/components/ui/empty-state";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import ChapterSidebar, { ChapterList } from "@/components/reading/chapter-sidebar";
import ReaderSettings, { useReaderPrefs } from "@/components/reading/reader-settings";
import { Splash } from "@/components/ui/patterns";
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

  const prefs = useReaderPrefs();

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
    return <PageLoader fullPage label="Loading story…" />;
  }

  // ── Not found ────────────────────────────────────────────────────────────────
  if (bookError || !book) {
    const status = (bookError as any)?.response?.status;
    return (
      <>
        <AppNav />
        {bookError && status !== 404 ? (
          <ErrorState fullPage title="We couldn't load this story" backHref="/library" backLabel="Back to library" />
        ) : (
          <EmptyState
            fullPage
            icon={BookX}
            title="Story not found"
            description="This story doesn't exist or has been removed by its author."
            action={
              <>
                <Link href="/discover" className="btn btn-dark btn-md">Browse stories</Link>
                <Link href="/library" className="btn btn-outline btn-md">Back to library</Link>
              </>
            }
          />
        )}
      </>
    );
  }

  const totalChapters = book.chapters?.length ?? 0;
  const hasPrev = currentChapter > 1;
  const hasNext = currentChapter < totalChapters;

  const authors = book.gutenberg_authors?.length
    ? book.gutenberg_authors
    : book.author
      ? [book.author.display_name || book.author.username]
      : [];
  const authorLine = authors.join(", ");

  // Whole-book progress: finished chapters + how far through this one
  const overallProgress =
    totalChapters > 0 ? Math.min(100, ((currentChapter - 1 + scrollProgress / 100) / totalChapters) * 100) : 0;
  const minutes = chapter?.word_count ? Math.max(1, Math.round(chapter.word_count / 230)) : null;
  const prevChapter = hasPrev ? book.chapters[currentChapter - 2] : null;
  const nextChapter = hasNext ? book.chapters[currentChapter] : null;

  return (
    <div
      className="min-h-screen bg-[color:var(--reader-bg)] text-[color:var(--reader-fg)] transition-colors duration-300"
      style={prefs.style}
    >
      {/* Top bar */}
      <header className="fixed left-0 right-0 top-0 z-30 h-14 border-b border-[color:var(--reader-line)] bg-[color:var(--reader-bg)]/90 backdrop-blur-xl lg:left-[320px]">
        <div className="mx-auto flex h-full max-w-5xl items-center gap-2 px-3 sm:px-5">
          <Link
            href="/library"
            aria-label="Back to library"
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-[color:var(--reader-fg)] transition-colors hover:bg-[color:var(--reader-panel)]"
          >
            <ArrowLeft className="h-[18px] w-[18px]" />
          </Link>

          <div className="min-w-0 flex-1 text-center lg:text-left">
            <p className="truncate text-sm font-bold leading-tight">{book.title}</p>
            {authorLine && <p className="truncate text-[11px] leading-tight text-[color:var(--reader-muted)]">{authorLine}</p>}
          </div>

          {totalChapters > 0 && (
            <span className="hidden flex-shrink-0 rounded-full bg-[color:var(--reader-panel)] px-3 py-1 text-xs font-semibold tabular-nums text-[color:var(--reader-muted)] sm:block">
              Chapter {currentChapter} of {totalChapters}
            </span>
          )}

          <ReaderSettings theme={prefs.theme} size={prefs.size} onTheme={prefs.setTheme} onSize={prefs.setSize} />

          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open chapter list"
            className="flex h-9 flex-shrink-0 items-center gap-2 rounded-full bg-[color:var(--reader-panel)] px-3.5 text-[13px] font-semibold transition-colors hover:bg-[color:var(--reader-line)] lg:hidden"
          >
            <List className="h-4 w-4" />
            <span className="hidden sm:inline">Contents</span>
          </button>
        </div>

        {/* Progress line */}
        <div className="absolute inset-x-0 bottom-[-1px] h-[3px] bg-transparent">
          <div className="h-full bg-brand-600 transition-[width] duration-200 ease-out" style={{ width: `${scrollProgress}%` }} />
        </div>
      </header>

      {/* Desktop contents rail */}
      <aside
        aria-label="Book contents"
        className="fixed bottom-0 left-0 top-0 z-20 hidden w-[320px] flex-col border-r border-[color:var(--reader-line)] bg-[color:var(--reader-bg)] lg:flex"
      >
        <div className="flex-shrink-0 border-b border-[color:var(--reader-line)] p-5">
          <div className="flex gap-4">
            <div className="h-[5.5rem] w-16 flex-shrink-0 overflow-hidden rounded-lg bg-[color:var(--reader-panel)] shadow-card">
              {book.cover_url ? (
                <img src={book.cover_url} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <BookOpen className="h-6 w-6 text-brand-600" />
                </div>
              )}
            </div>
            <div className="min-w-0">
              <Link href="/discover" className="eyebrow !text-[color:var(--reader-accent)] hover:underline">Caesura</Link>
              <h2 className="mt-1 line-clamp-3 text-[15px] font-bold leading-snug">{book.title}</h2>
              {authorLine && <p className="mt-1 line-clamp-1 text-xs text-[color:var(--reader-muted)]">{authorLine}</p>}
            </div>
          </div>

          <div className="mt-4">
            <div className="mb-1.5 flex items-center justify-between text-[11px] font-semibold text-[color:var(--reader-muted)]">
              <span>Your progress</span>
              <span className="tabular-nums">{Math.round(overallProgress)}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-[color:var(--reader-line)]">
              <div className="h-full rounded-full bg-brand-600 transition-[width] duration-300" style={{ width: `${overallProgress}%` }} />
            </div>
          </div>
        </div>

        <p className="px-5 pb-1 pt-4 text-[11px] font-bold uppercase tracking-widest text-[color:var(--reader-muted)]">
          {totalChapters} {totalChapters === 1 ? "chapter" : "chapters"}
        </p>
        <div className="flex-1 overflow-y-auto pb-4">
          <ChapterList chapters={book.chapters || []} currentChapter={currentChapter} onSelect={handleChapterChange} />
        </div>
      </aside>

      {/* Contents drawer (screens without the rail) */}
      <div className="lg:hidden">
        <ChapterSidebar
          chapters={book.chapters || []}
          currentChapter={currentChapter}
          onChapterSelect={handleChapterChange}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          bookTitle={book.title}
        />
      </div>

      {/* Reading area */}
      <main className="min-h-screen pb-28 pt-14 lg:pl-[320px]">
        <div className="mx-auto max-w-[44rem] px-5 sm:px-8">
          {chapterLoading ? (
            <PageLoader label="Loading chapter…" />
          ) : !chapter ? (
            <ErrorState title="Failed to load this chapter" description="The chapter content didn't load. Please try again." />
          ) : (
            <>
              {/* Chapter header */}
              <header className="animate-fade-up pb-10 pt-12 text-center sm:pb-14 sm:pt-16">
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[color:var(--reader-accent)]">
                  {chapter.title && !/^chapter/i.test(chapter.title) ? `Chapter ${chapter.chapter_number}` : book.title}
                </p>
                <h1 className="mt-3 font-brand text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl">
                  {chapter.title || `Chapter ${chapter.chapter_number}`}
                </h1>

                <div className="mt-5 flex items-center justify-center gap-2.5 text-xs text-[color:var(--reader-muted)]">
                  {chapter.word_count ? <span>{chapter.word_count.toLocaleString()} words</span> : null}
                  {chapter.word_count && minutes ? <span aria-hidden="true">·</span> : null}
                  {minutes ? <span>{minutes} min read</span> : null}
                </div>

                {/* Ornament: a pause between the title and the story */}
                <div className="mx-auto mt-8 flex items-center justify-center gap-3" aria-hidden="true">
                  <span className="h-px w-12 bg-[color:var(--reader-line)]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-600" />
                  <span className="h-px w-12 bg-[color:var(--reader-line)]" />
                </div>
              </header>

              {/* Body */}
              <TipTapRenderer contentHtml={chapter.content_html} content={chapter.content} dropCap />

              {/* End of chapter */}
              <nav className="mt-20" aria-label="Chapter navigation">
                {!hasNext && (
                  <div className="relative mb-6 overflow-hidden rounded-3xl bg-brand-50 p-8 text-center">
                    <Splash variant="c" className="-right-6 -top-6 h-28 w-28 text-brand-200" />
                    <p className="relative text-[11px] font-bold uppercase tracking-[0.22em] text-brand-700">The end</p>
                    <h3 className="relative mt-2 font-brand text-3xl font-black text-zinc-950">You finished {book.title}</h3>
                    <div className="relative mt-5 flex flex-wrap justify-center gap-3">
                      <Link href="/discover" className="btn btn-primary btn-md">
                        Find your next story <ArrowRight className="h-4 w-4" />
                      </Link>
                      <Link href="/library" className="btn btn-outline btn-md">Back to library</Link>
                    </div>
                  </div>
                )}

                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => hasPrev && handleChapterChange(currentChapter - 1)}
                    disabled={!hasPrev}
                    className="group flex items-center gap-3 rounded-2xl border border-[color:var(--reader-line)] p-4 text-left transition-colors hover:bg-[color:var(--reader-panel)] disabled:pointer-events-none disabled:opacity-40"
                  >
                    <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[color:var(--reader-panel)] transition-transform group-hover:-translate-x-0.5">
                      <ChevronLeft className="h-5 w-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[11px] font-bold uppercase tracking-widest text-[color:var(--reader-muted)]">Previous</span>
                      <span className="block truncate text-sm font-semibold">{prevChapter ? prevChapter.title || `Chapter ${currentChapter - 1}` : "You're at the start"}</span>
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => hasNext && handleChapterChange(currentChapter + 1)}
                    disabled={!hasNext}
                    className="group flex items-center justify-end gap-3 rounded-2xl bg-zinc-950 p-4 text-right text-white transition-colors hover:bg-zinc-800 disabled:pointer-events-none disabled:opacity-40"
                  >
                    <span className="min-w-0">
                      <span className="block text-[11px] font-bold uppercase tracking-widest text-zinc-400">Next</span>
                      <span className="block truncate text-sm font-semibold">{nextChapter ? nextChapter.title || `Chapter ${currentChapter + 1}` : "No more chapters"}</span>
                    </span>
                    <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-brand-600 transition-transform group-hover:translate-x-0.5">
                      <ChevronRight className="h-5 w-5" />
                    </span>
                  </button>
                </div>
              </nav>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
