"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AppNav from "@/components/layout/app-nav";
import { booksAPI } from "@/lib/api/books";
import { useAuth } from "@/app/providers/auth-provider";

export default function CreateStoryPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [step, setStep] = useState<"create" | "done">("create");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [authors, setAuthors] = useState<string[]>([]);
  const [authorInput, setAuthorInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [createdBook, setCreatedBook] = useState<API.CreateBookResponse | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push("/login");
  }, [isAuthenticated, authLoading, router]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = "Story title is required";
    if (description.length > 500) newErrors.description = "Keep it under 500 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const book = await booksAPI.createBook({
        title: title.trim(),
        description: description.trim() || undefined,
        language: "en",
        authors: authors.length > 0 ? authors : undefined,
      });
      setCreatedBook(book);
      setStep("done");
    } catch (error: any) {
      setErrors({
        submit:
          error?.response?.data?.error ||
          error?.message ||
          "Failed to create story",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAuthor = () => {
    const trimmed = authorInput.trim();
    if (trimmed && !authors.includes(trimmed)) {
      setAuthors([...authors, trimmed]);
      setAuthorInput("");
    }
  };

  const handleRemoveAuthor = (index: number) => {
    setAuthors(authors.filter((_, i) => i !== index));
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="inline-flex h-8 w-8 animate-spin rounded-full border-[3px] border-zinc-200 border-t-zinc-700" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <AppNav />

      <main className="pt-[60px]">
        {step === "create" ? (
          <div className="mx-auto max-w-2xl px-4 sm:px-6 py-12">
            {/* Page header */}
            <div className="mb-10">
              <Link
                href="/write"
                className="inline-flex items-center gap-1 text-[13px] text-zinc-400 hover:text-zinc-700 transition-colors mb-6"
              >
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to writing
              </Link>
              <h1 className="text-[28px] sm:text-[34px] font-extrabold text-zinc-900 tracking-tight leading-tight">
                Start a new story
              </h1>
              <p className="mt-2 text-[15px] text-zinc-500">
                Set up the basics — you can always edit these later.
              </p>
            </div>

            {errors.submit && (
              <div className="mb-8 rounded-xl bg-red-50 border border-red-100 px-4 py-3">
                <p className="text-sm text-red-700">{errors.submit}</p>
              </div>
            )}

            <form onSubmit={handleCreateBook} className="space-y-7">
              {/* Title */}
              <div className="space-y-1.5">
                <label htmlFor="title" className="block text-[13px] font-semibold text-zinc-700">
                  Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (errors.title) setErrors((prev) => ({ ...prev, title: "" }));
                  }}
                  placeholder="Give your story a title…"
                  className={`w-full px-4 py-3 rounded-xl border text-[15px] font-medium text-zinc-900 placeholder:text-zinc-300 bg-white outline-none transition-all ${
                    errors.title
                      ? "border-red-300 ring-1 ring-red-200"
                      : "border-zinc-200 focus:border-zinc-400 focus:ring-1 focus:ring-zinc-100"
                  }`}
                  disabled={isLoading}
                  autoFocus
                />
                {errors.title && (
                  <p className="text-[12px] text-red-500 mt-1">{errors.title}</p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <div className="flex items-baseline justify-between">
                  <label htmlFor="description" className="block text-[13px] font-semibold text-zinc-700">
                    Description
                    <span className="ml-1.5 text-[11px] font-normal text-zinc-400">(optional)</span>
                  </label>
                  <span className={`text-[11px] tabular-nums ${description.length > 480 ? "text-red-400" : "text-zinc-300"}`}>
                    {description.length}/500
                  </span>
                </div>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="A short summary of what your story is about…"
                  rows={4}
                  className={`w-full px-4 py-3 rounded-xl border text-[14px] text-zinc-900 placeholder:text-zinc-300 bg-white outline-none resize-none transition-all ${
                    errors.description
                      ? "border-red-300 ring-1 ring-red-200"
                      : "border-zinc-200 focus:border-zinc-400 focus:ring-1 focus:ring-zinc-100"
                  }`}
                  disabled={isLoading}
                />
                {errors.description && (
                  <p className="text-[12px] text-red-500">{errors.description}</p>
                )}
              </div>

              {/* Co-authors */}
              <div className="space-y-1.5">
                <label className="block text-[13px] font-semibold text-zinc-700">
                  Co-authors
                  <span className="ml-1.5 text-[11px] font-normal text-zinc-400">(optional)</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={authorInput}
                    onChange={(e) => setAuthorInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") { e.preventDefault(); handleAddAuthor(); }
                    }}
                    placeholder="Name, then press Enter…"
                    className="flex-1 px-4 py-3 rounded-xl border border-zinc-200 text-[14px] text-zinc-900 placeholder:text-zinc-300 bg-white outline-none transition-all focus:border-zinc-400 focus:ring-1 focus:ring-zinc-100"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={handleAddAuthor}
                    disabled={isLoading || !authorInput.trim()}
                    className="cursor-pointer px-4 py-3 rounded-xl border border-zinc-200 text-[13px] font-semibold text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Add
                  </button>
                </div>
                {authors.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {authors.map((author, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1 rounded-full border border-zinc-200 bg-zinc-50 text-[12px] font-semibold text-zinc-700"
                      >
                        {author}
                        <button
                          type="button"
                          onClick={() => handleRemoveAuthor(index)}
                          className="cursor-pointer h-4 w-4 rounded-full flex items-center justify-center hover:bg-zinc-200 text-zinc-400 hover:text-zinc-700 transition-colors"
                        >
                          <svg className="h-2.5 w-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Hint */}
              <div className="rounded-xl border border-zinc-100 bg-zinc-50 px-4 py-3.5 flex gap-3">
                <svg className="h-4 w-4 text-zinc-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-[13px] text-zinc-500 leading-relaxed">
                  After creating your story you&apos;ll add chapters one by one — each with its own title and rich formatted content.
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-1">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="cursor-pointer flex items-center gap-2 px-6 py-2.5 rounded-xl bg-zinc-900 text-white text-[13px] font-semibold hover:bg-zinc-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <span className="inline-flex h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Creating…
                    </>
                  ) : (
                    "Create story"
                  )}
                </button>
                <Link
                  href="/write"
                  className="inline-flex items-center px-6 py-2.5 rounded-xl border border-zinc-200 text-zinc-600 text-[13px] font-semibold hover:bg-zinc-50 hover:border-zinc-300 active:scale-95 transition-all"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        ) : createdBook ? (
          <div className="mx-auto max-w-2xl px-4 sm:px-6 py-12">
            {/* Success state */}
            <div className="mb-8 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                <svg className="h-5 w-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-widest text-emerald-600">Story created</p>
                <h1 className="text-[24px] font-extrabold text-zinc-900 leading-tight tracking-tight mt-0.5">
                  {createdBook.title}
                </h1>
              </div>
            </div>

            <p className="text-[15px] text-zinc-500 mb-8">
              Your story is ready. Write your first chapter to bring it to life.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href={`/write/${createdBook.slug}/chapter/new`}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-zinc-900 text-white text-[13px] font-semibold hover:bg-zinc-700 active:scale-95 transition-all"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Write first chapter
              </Link>
              <Link
                href={`/write/${createdBook.slug}`}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-zinc-200 text-zinc-700 text-[13px] font-semibold hover:bg-zinc-50 hover:border-zinc-300 active:scale-95 transition-all"
              >
                Story dashboard
              </Link>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}
