"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, BookX, Check, Loader2 } from "lucide-react";
import AppNav from "@/components/layout/app-nav";
import { toast } from "sonner";
import EmptyState, { ErrorState, PageLoader } from "@/components/ui/empty-state";
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
            toast.error("Failed to load chapter content", { description: "Please refresh to try again." });
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
      toast.error("Please write something before saving");
      return;
    }

    setIsSaving(true);
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
      toast.success(isNew ? "Chapter created" : "Chapter saved");
      setTimeout(() => router.push(`/write/${bookSlug}`), 600);
    } catch (err: any) {
      toast.error("Couldn't save your chapter", {
        description: err?.response?.data?.error || err?.message || "Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const displayNumber = isNew ? (book?.chapters?.length || 0) + 1 : chapterNumber;

  // ── Loading ──────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <>
        <AppNav />
        <PageLoader fullPage label="Loading chapter…" />
      </>
    );
  }

  // ── Error / not found ────────────────────────────────────────────────────
  if (!book) {
    return (
      <>
        <AppNav />
        {error ? (
          <ErrorState fullPage title="We couldn't load this chapter" description={error} backHref="/write" backLabel="Back to writing" />
        ) : (
          <EmptyState
            fullPage
            icon={BookX}
            title="Story not found"
            description="This story doesn't exist, or you don't have access to it."
            action={<Link href="/write" className="btn btn-dark btn-md">Back to writing</Link>}
          />
        )}
      </>
    );
  }

  // ── Editor ───────────────────────────────────────────────────────────────
  const saveLabel = saved ? "Saved" : isSaving ? "Saving…" : isNew ? "Save chapter" : "Update";

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Top bar */}
      <header className="fixed inset-x-0 top-0 z-20 h-14 border-b border-zinc-200 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-full max-w-5xl items-center gap-3 px-3 sm:px-5">
          <Link
            href={`/write/${bookSlug}`}
            aria-label="Back to story"
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-zinc-700 transition-colors hover:bg-zinc-100"
          >
            <ArrowLeft className="h-[18px] w-[18px]" />
          </Link>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold leading-tight text-zinc-950">{book.title}</p>
            <p className="text-[11px] leading-tight text-zinc-500">{isNew ? "New chapter" : `Chapter ${displayNumber}`}</p>
          </div>

          {wordCount > 0 && (
            <span className="badge badge-neutral hidden tabular-nums sm:inline-flex">{formatWords(wordCount)} words</span>
          )}

          <button
            type="button"
            onClick={() => handleSave()}
            disabled={isSaving || saved}
            className={`btn btn-md flex-shrink-0 ${saved ? "bg-green-600 text-white" : "btn-primary"}`}
          >
            {saved ? <Check className="h-4 w-4" /> : isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {saveLabel}
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="pb-24 pt-14">
        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
          {/* Chapter title: styled like the reader's chapter heading */}
          <p className="eyebrow mb-3 text-center">{isNew ? "New chapter" : `Chapter ${displayNumber}`}</p>
          <input
            type="text"
            value={chapterTitle}
            onChange={(e) => {
              setChapterTitle(e.target.value);
              setSaved(false);
            }}
            placeholder="Untitled chapter"
            aria-label="Chapter title"
            className="mb-8 w-full border-none bg-transparent text-center font-brand text-4xl font-black leading-tight tracking-tight text-zinc-950 outline-none placeholder:text-zinc-300 sm:text-5xl"
            disabled={isSaving}
          />

          <StoryEditor
            initialContent={chapterContent}
            onChange={handleContentChange}
            onHtmlChange={() => {}}
            disabled={isSaving}
            placeholder="Start writing your chapter here…"
          />

          {wordCount > 0 && (
            <p className="mt-3 text-right text-xs tabular-nums text-zinc-500 sm:hidden">{formatWords(wordCount)} words</p>
          )}
        </div>
      </main>
    </div>
  );
}
