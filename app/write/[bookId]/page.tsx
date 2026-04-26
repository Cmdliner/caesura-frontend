"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import AppNav from "@/components/layout/app-nav";
import { booksAPI } from "@/lib/api/books";
import { useAuth } from "@/app/providers/auth-provider";

// ── Confirmation modal ────────────────────────────────────────────────────────

interface ConfirmModalProps {
  open: boolean;
  title: string;
  description: string;
  /** If provided the user must type this exact string to confirm */
  confirmPhrase?: string;
  confirmLabel: string;
  danger?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmModal({
  open,
  title,
  description,
  confirmPhrase,
  confirmLabel,
  danger = false,
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const [typed, setTyped] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTyped("");
      setTimeout(() => inputRef.current?.focus(), 60);
    }
  }, [open]);

  if (!open) return null;

  const phraseOk = !confirmPhrase || typed.trim() === confirmPhrase.trim();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Panel */}
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl border border-zinc-200 animate-scale-in">
        <div className="p-6">
          {/* Icon */}
          <div className={`mx-auto mb-4 h-12 w-12 rounded-full flex items-center justify-center ${
            danger ? "bg-red-100" : "bg-zinc-100"
          }`}>
            {danger ? (
              <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            ) : (
              <svg className="h-6 w-6 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            )}
          </div>

          <h2 className="text-center text-[17px] font-bold text-zinc-900 mb-2">{title}</h2>
          <p className="text-center text-sm text-zinc-500 leading-relaxed mb-5">{description}</p>

          {/* Type-to-confirm */}
          {confirmPhrase && (
            <div className="mb-5 space-y-2">
              <p className="text-[12.5px] text-zinc-500">
                Type{" "}
                <span className="font-mono font-bold text-zinc-800 bg-zinc-100 px-1.5 py-0.5 rounded">
                  {confirmPhrase}
                </span>{" "}
                to confirm:
              </p>
              <input
                ref={inputRef}
                type="text"
                value={typed}
                onChange={(e) => setTyped(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && phraseOk && !loading && onConfirm()}
                className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 text-sm font-mono focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-200 transition-colors"
                placeholder={confirmPhrase}
                disabled={loading}
                autoComplete="off"
                spellCheck={false}
              />
            </div>
          )}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="flex-1 px-4 py-2.5 rounded-xl border border-zinc-200 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={!phraseOk || loading}
              className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                danger ? "bg-red-600 hover:bg-red-700" : "bg-zinc-900 hover:bg-zinc-700"
              }`}
            >
              {loading ? "Please wait…" : confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

type ModalState =
  | { type: "none" }
  | { type: "publish-book"; newStatus: "published" | "draft" }
  | { type: "delete-book" }
  | { type: "publish-chapter"; chapter: API.ChapterSummary; newStatus: "published" | "draft" }
  | { type: "delete-chapter"; chapter: API.ChapterSummary };

export default function BookWritePage() {
  const router = useRouter();
  const params = useParams();
  const bookSlug = params?.bookId as string;
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const [book, setBook] = useState<API.BookDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState<ModalState>({ type: "none" });
  const [actionLoading, setActionLoading] = useState(false);

  // Inline title editing
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState("");
  const [titleSaving, setTitleSaving] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push("/login");
  }, [isAuthenticated, authLoading, router]);

  const reload = () => {
    if (!bookSlug) return;
    setIsLoading(true);
    booksAPI
      .getAuthoredBook(bookSlug)
      .then(setBook)
      .catch((err) => setError(err?.message || "Failed to load story"))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => { reload(); }, [bookSlug]);

  const closeModal = () => setModal({ type: "none" });

  const handleConfirm = async () => {
    if (!book || modal.type === "none") return;
    setActionLoading(true);
    try {
      if (modal.type === "publish-book") {
        await booksAPI.updateBook(book.id, { status: modal.newStatus });
        setBook((b) => b ? { ...b, status: modal.newStatus } : b);
        closeModal();
      } else if (modal.type === "delete-book") {
        await booksAPI.deleteBook(book.id);
        closeModal();
        router.push("/write");
      } else if (modal.type === "publish-chapter") {
        await booksAPI.updateChapter(book.id, modal.chapter.id, { status: modal.newStatus });
        reload();
        closeModal();
      } else if (modal.type === "delete-chapter") {
        await booksAPI.deleteChapter(book.id, modal.chapter.id);
        setBook((b) =>
          b ? { ...b, chapters: b.chapters.filter((c) => c.id !== modal.chapter.id) } : b
        );
        closeModal();
      }
    } catch {
      // keep modal open so user sees the error state
    } finally {
      setActionLoading(false);
    }
  };

  const startEditTitle = () => {
    if (!book) return;
    setTitleDraft(book.title);
    setEditingTitle(true);
    setTimeout(() => titleInputRef.current?.focus(), 40);
  };

  const cancelEditTitle = () => {
    setEditingTitle(false);
    setTitleDraft("");
  };

  const saveTitle = async () => {
    if (!book || !titleDraft.trim() || titleDraft.trim() === book.title) {
      cancelEditTitle();
      return;
    }
    setTitleSaving(true);
    try {
      const updated = await booksAPI.updateBook(book.id, { title: titleDraft.trim() });
      setBook((b) => b ? { ...b, title: updated.title, slug: updated.slug } : b);
      setEditingTitle(false);
      // Navigate to new slug if it changed
      if (updated.slug && updated.slug !== bookSlug) {
        router.replace(`/write/${updated.slug}`);
      }
    } catch {
      // silent — leave edit mode open
    } finally {
      setTitleSaving(false);
    }
  };

  // ── Derive modal config ──────────────────────────────────────────────────
  let modalProps: Omit<ConfirmModalProps, "onConfirm" | "onCancel"> = {
    open: false,
    title: "",
    description: "",
    confirmLabel: "Confirm",
  };

  if (modal.type === "delete-book" && book) {
    modalProps = {
      open: true,
      title: "Delete this story permanently?",
      description: `All chapters and content in "${book.title}" will be lost forever. This cannot be undone.`,
      confirmPhrase: book.title,
      confirmLabel: "Delete story forever",
      danger: true,
    };
  } else if (modal.type === "publish-book" && book) {
    const unpublishing = modal.newStatus === "draft";
    modalProps = {
      open: true,
      title: unpublishing ? "Unpublish story?" : "Publish story?",
      description: unpublishing
        ? `"${book.title}" will be hidden from readers until you publish it again.`
        : `"${book.title}" will be visible to all readers. Make sure your content is ready.`,
      confirmLabel: unpublishing ? "Yes, unpublish" : "Yes, publish",
      danger: unpublishing,
    };
  } else if (modal.type === "publish-chapter" && book) {
    const unpublishing = modal.newStatus === "draft";
    const ch = modal.chapter;
    const label = ch.title || `Chapter ${ch.chapter_number}`;
    modalProps = {
      open: true,
      title: unpublishing ? "Unpublish chapter?" : "Publish chapter?",
      description: unpublishing
        ? `"${label}" will be hidden from readers.`
        : `"${label}" will become visible to all readers.`,
      confirmLabel: unpublishing ? "Yes, unpublish" : "Yes, publish",
      danger: unpublishing,
    };
  } else if (modal.type === "delete-chapter") {
    const ch = modal.chapter;
    const label = ch.title || `Chapter ${ch.chapter_number}`;
    modalProps = {
      open: true,
      title: "Delete chapter permanently?",
      description: `This cannot be undone. All content in "${label}" will be lost forever.`,
      confirmPhrase: label,
      confirmLabel: "Delete forever",
      danger: true,
    };
  }

  // ── Render ───────────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-50">
        <AppNav />
        <main className="pt-24 pb-16 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-flex h-8 w-8 animate-spin rounded-full border-[3px] border-zinc-200 border-t-zinc-700" />
            <p className="mt-4 text-sm text-zinc-500">Loading…</p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen bg-zinc-50">
        <AppNav />
        <main className="pt-24 pb-16">
          <div className="mx-auto max-w-2xl px-4">
            <div className="rounded-xl bg-red-50 border border-red-200 p-6 text-center">
              <p className="text-red-700 font-semibold">{error || "Story not found"}</p>
              <Link href="/write" className="mt-4 inline-block text-sm text-zinc-600 hover:underline">
                ← Back to writing
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const totalWords = book.chapters?.reduce((s, ch) => s + (ch.word_count || 0), 0) ?? 0;
  const isPublished = book.status === "published";

  return (
    <>
      <ConfirmModal
        {...modalProps}
        loading={actionLoading}
        onConfirm={handleConfirm}
        onCancel={closeModal}
      />

      <div className="min-h-screen bg-zinc-50">
        <AppNav />

        <main className="pt-[60px] pb-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">

            <Link
              href="/write"
              className="inline-flex items-center gap-1.5 text-[13px] text-zinc-500 hover:text-zinc-800 transition-colors mt-6 mb-8"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              All stories
            </Link>

            {/* Story header card */}
            <div className="rounded-2xl bg-white border border-zinc-200 shadow-sm p-6 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide ${
                      isPublished ? "bg-emerald-100 text-emerald-700" : "bg-zinc-100 text-zinc-600"
                    }`}>
                      {isPublished ? "Published" : "Draft"}
                    </span>
                  </div>
                  {editingTitle ? (
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        ref={titleInputRef}
                        type="text"
                        value={titleDraft}
                        onChange={(e) => setTitleDraft(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveTitle();
                          if (e.key === "Escape") cancelEditTitle();
                        }}
                        className="flex-1 text-xl font-extrabold text-zinc-900 bg-zinc-50 border border-zinc-300 rounded-lg px-3 py-1.5 outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-200 transition-all"
                        disabled={titleSaving}
                      />
                      <button
                        type="button"
                        onClick={saveTitle}
                        disabled={titleSaving || !titleDraft.trim()}
                        className="cursor-pointer px-3 py-1.5 rounded-lg bg-zinc-900 text-white text-[12px] font-semibold hover:bg-zinc-700 active:scale-95 transition-all disabled:opacity-40"
                      >
                        {titleSaving ? "Saving…" : "Save"}
                      </button>
                      <button
                        type="button"
                        onClick={cancelEditTitle}
                        disabled={titleSaving}
                        className="cursor-pointer px-3 py-1.5 rounded-lg border border-zinc-200 text-zinc-600 text-[12px] font-semibold hover:bg-zinc-50 active:scale-95 transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={startEditTitle}
                      className="cursor-pointer group/title flex items-center gap-2 text-left"
                      title="Click to rename"
                    >
                      <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 leading-tight group-hover/title:text-zinc-600 transition-colors">
                        {book.title}
                      </h1>
                      <svg
                        className="h-4 w-4 text-zinc-300 group-hover/title:text-zinc-500 transition-colors flex-shrink-0 mt-1"
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                  )}
                  {book.description && (
                    <p className="mt-2 text-sm text-zinc-500 leading-relaxed line-clamp-2">
                      {book.description}
                    </p>
                  )}
                </div>

                <div className="flex gap-2 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() =>
                      setModal({
                        type: "publish-book",
                        newStatus: isPublished ? "draft" : "published",
                      })
                    }
                    className={`cursor-pointer px-4 py-2 rounded-xl text-[13px] font-semibold transition-all active:scale-[0.97] ${
                      isPublished
                        ? "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                        : "bg-emerald-600 text-white hover:bg-emerald-700"
                    }`}
                  >
                    {isPublished ? "Unpublish" : "Publish story"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setModal({ type: "delete-book" })}
                    className="cursor-pointer p-2 rounded-xl text-zinc-400 hover:text-red-500 hover:bg-red-50 active:scale-[0.97] transition-all"
                    title="Delete this story"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Stats strip */}
              <div className="mt-5 pt-5 border-t border-zinc-100 grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-xl font-bold text-zinc-900">{book.chapters?.length ?? 0}</p>
                  <p className="text-[11px] uppercase font-semibold tracking-wide text-zinc-400 mt-0.5">Chapters</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-zinc-900">{totalWords.toLocaleString()}</p>
                  <p className="text-[11px] uppercase font-semibold tracking-wide text-zinc-400 mt-0.5">Words</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-zinc-900">
                    {new Date(book.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </p>
                  <p className="text-[11px] uppercase font-semibold tracking-wide text-zinc-400 mt-0.5">Created</p>
                </div>
              </div>
            </div>

            {/* Chapters header */}
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-[15px] font-bold text-zinc-900">Chapters</h2>
              <Link
                href={`/write/${book.slug}/chapter/new`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-900 text-white text-[13px] font-semibold hover:bg-zinc-700 transition-colors"
              >
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
                Add chapter
              </Link>
            </div>

            {book.chapters && book.chapters.length > 0 ? (
              <div className="space-y-2">
                {book.chapters.map((chapter) => {
                  const isChapterPublished = !!chapter.published_at;
                  const label = chapter.title || `Chapter ${chapter.chapter_number}`;
                  return (
                    <div
                      key={chapter.id}
                      className="group flex items-center gap-3 p-4 rounded-xl bg-white border border-zinc-200 hover:border-zinc-300 transition-colors"
                    >
                      {/* Number badge */}
                      <div className="h-8 w-8 rounded-lg bg-zinc-100 flex items-center justify-center flex-shrink-0 text-[12px] font-bold text-zinc-600">
                        {chapter.chapter_number}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-[14px] font-semibold text-zinc-900 truncate">{label}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={`text-[11px] font-semibold ${
                            isChapterPublished ? "text-emerald-600" : "text-zinc-400"
                          }`}>
                            {isChapterPublished ? "Published" : "Draft"}
                          </span>
                          {chapter.word_count ? (
                            <span className="text-[11px] text-zinc-400">
                              · {chapter.word_count.toLocaleString()} words
                            </span>
                          ) : null}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <Link
                          href={`/write/${book.slug}/chapter/${chapter.chapter_number}`}
                          className="cursor-pointer px-3 py-1.5 rounded-lg text-[12px] font-semibold text-zinc-700 bg-zinc-100 hover:bg-zinc-200 active:scale-95 transition-all"
                        >
                          Edit
                        </Link>

                        <button
                          type="button"
                          onClick={() =>
                            setModal({
                              type: "publish-chapter",
                              chapter,
                              newStatus: isChapterPublished ? "draft" : "published",
                            })
                          }
                          className={`cursor-pointer px-3 py-1.5 rounded-lg text-[12px] font-semibold active:scale-95 transition-all ${
                            isChapterPublished
                              ? "text-zinc-600 bg-zinc-100 hover:bg-zinc-200"
                              : "text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100"
                          }`}
                        >
                          {isChapterPublished ? "Unpublish" : "Publish"}
                        </button>

                        <button
                          type="button"
                          onClick={() => setModal({ type: "delete-chapter", chapter })}
                          className="cursor-pointer p-1.5 rounded-lg text-zinc-300 hover:text-red-500 hover:bg-red-50 active:scale-95 transition-all opacity-0 group-hover:opacity-100"
                          title="Delete chapter"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-2xl border-2 border-dashed border-zinc-200 bg-white p-10 text-center">
                <div className="mx-auto mb-4 h-12 w-12 rounded-xl bg-zinc-100 flex items-center justify-center">
                  <svg className="h-6 w-6 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <p className="text-[14px] font-semibold text-zinc-700">No chapters yet</p>
                <p className="text-sm text-zinc-400 mt-1">Add your first chapter to get started.</p>
                <Link
                  href={`/write/${book.slug}/chapter/new`}
                  className="mt-5 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-zinc-900 text-white text-sm font-semibold hover:bg-zinc-700 transition-colors"
                >
                  Write first chapter →
                </Link>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
