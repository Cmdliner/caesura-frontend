"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import StoryEditor from "@/components/editor/story-editor";
import { booksAPI } from "@/lib/api/books";
import { useAuth } from "@/app/providers/auth-provider";

function extractWordCount(doc: Record<string, unknown> | null): number {
  if (!doc) return 0;
  let text = "";
  function traverse(node: any) {
    if (typeof node.text === "string") text += node.text + " ";
    if (Array.isArray(node.content)) node.content.forEach(traverse);
  }
  traverse(doc);
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function formatWords(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  return `${n}`;
}

export default function WriteChapterPage() {
  const router = useRouter();
  const params = useParams();
  const bookSlug = params?.bookId as string;
  const chapterParam = params?.chapterId as string;
  const isNew = chapterParam === "new";
  const chapterNumber = isNew ? null : parseInt(chapterParam) || null;
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const [book, setBook] = useState<API.BookDetail | null>(null);
  const [existingChapterId, setExistingChapterId] = useState<string | null>(null);
  const [chapterTitle, setChapterTitle] = useState("");
  const [chapterContent, setChapterContent] = useState<Record<string, unknown> | null>(null);
  const [wordCount, setWordCount] = useState(0);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push("/login");
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (!bookSlug) return;
    setIsLoading(true);
    booksAPI
      .getAuthoredBook(bookSlug)
      .then(async (loadedBook) => {
        setBook(loadedBook);
        if (!isNew && chapterNumber) {
          try {
            const chapter = await booksAPI.getAuthoredChapter(loadedBook.id, chapterNumber);
            setExistingChapterId(chapter.id);
            setChapterTitle(chapter.title || "");
            if (chapter.content) {
              const content = chapter.content as Record<string, unknown>;
              setChapterContent(content);
              setWordCount(extractWordCount(content));
            }
          } catch {
            setError("Failed to load chapter content.");
          }
        }
      })
      .catch((err) => setError(err?.message || "Failed to load story"))
      .finally(() => setIsLoading(false));
  }, [bookSlug, isNew, chapterNumber]);

  const handleContentChange = (content: Record<string, unknown>) => {
    setChapterContent(content);
    setWordCount(extractWordCount(content));
    setSaved(false);
  };

  const handleSave = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!book) return;

    if (!chapterContent) {
      setError("Please write something before saving.");
      return;
    }

    setIsSaving(true);
    setError("");
    const wc = extractWordCount(chapterContent);
    try {
      if (isNew) {
        const nextNumber = (book.chapters?.length || 0) + 1;
        await booksAPI.createChapter(book.id, {
          chapter_number: nextNumber,
          title: chapterTitle.trim() || undefined,
          content: chapterContent,
          word_count: wc,
        });
      } else if (existingChapterId) {
        await booksAPI.updateChapter(book.id, existingChapterId, {
          title: chapterTitle.trim() || undefined,
          content: chapterContent,
          word_count: wc,
        });
      }
      setSaved(true);
      setTimeout(() => router.push(`/write/${bookSlug}`), 600);
    } catch (err: any) {
      setError(
        err?.response?.data?.error || err?.message || "Failed to save chapter"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const displayNumber = isNew ? (book?.chapters?.length || 0) + 1 : chapterNumber;

  // ── Loading ──────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex h-8 w-8 animate-spin rounded-full border-[3px] border-zinc-200 border-t-zinc-700" />
          <p className="mt-4 text-sm text-zinc-400">Loading…</p>
        </div>
      </div>
    );
  }

  // ── Error / not found ────────────────────────────────────────────────────
  if (!book) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center px-4">
        <div className="rounded-2xl bg-white border border-zinc-200 p-8 text-center max-w-sm shadow-sm">
          <p className="text-zinc-700 font-semibold">{error || "Story not found"}</p>
          <Link href="/write" className="mt-4 inline-block text-sm text-zinc-500 hover:text-zinc-800 underline-offset-2 hover:underline">
            ← Back to writing
          </Link>
        </div>
      </div>
    );
  }

  // ── Editor ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-zinc-50">
      {/* ── Top bar ──────────────────────────────────────────────────── */}
      <header className="fixed top-0 inset-x-0 z-20 h-14 flex items-center justify-between px-4 sm:px-6 bg-white border-b border-zinc-200 shadow-sm">
        {/* Left: back link */}
        <Link
          href={`/write/${bookSlug}`}
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="hidden sm:inline max-w-[180px] truncate">{book.title}</span>
          <span className="sm:hidden">Back</span>
        </Link>

        {/* Centre: chapter label */}
        <span className="absolute left-1/2 -translate-x-1/2 text-[13px] font-semibold text-zinc-500 pointer-events-none">
          {isNew ? "New chapter" : `Chapter ${displayNumber}`}
        </span>

        {/* Right: word count + save */}
        <div className="flex items-center gap-3">
          {wordCount > 0 && (
            <span className="hidden sm:block text-[12px] text-zinc-400 tabular-nums">
              {formatWords(wordCount)} words
            </span>
          )}
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || saved}
            className={`cursor-pointer px-4 py-1.5 rounded-lg text-[13px] font-semibold transition-all active:scale-[0.97] disabled:cursor-not-allowed ${
              saved
                ? "bg-emerald-500 text-white"
                : "bg-zinc-900 text-white hover:bg-zinc-700 disabled:opacity-50"
            }`}
          >
            {saved ? "Saved ✓" : isSaving ? "Saving…" : isNew ? "Save" : "Update"}
          </button>
        </div>
      </header>

      {/* ── Main content ─────────────────────────────────────────────── */}
      <main className="pt-14 pb-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10">

          {/* Error banner */}
          {error && (
            <div className="mb-6 rounded-xl bg-red-50 border border-red-200 px-4 py-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Chapter title input — part of the document feel */}
          <input
            type="text"
            value={chapterTitle}
            onChange={(e) => { setChapterTitle(e.target.value); setSaved(false); }}
            placeholder={`Chapter ${displayNumber} title (optional)`}
            className="w-full mb-6 text-2xl sm:text-3xl font-bold text-zinc-900 placeholder:text-zinc-300 bg-transparent border-none outline-none focus:outline-none resize-none"
            disabled={isSaving}
          />

          {/* Rich text editor */}
          <StoryEditor
            initialContent={chapterContent}
            onChange={handleContentChange}
            onHtmlChange={() => {}}
            disabled={isSaving}
            placeholder="Start writing your chapter here…"
          />

          {/* Mobile word count */}
          {wordCount > 0 && (
            <p className="sm:hidden mt-3 text-right text-[12px] text-zinc-400 tabular-nums">
              {formatWords(wordCount)} words
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
