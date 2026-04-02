"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import AppHeader from "@/components/layout/app-header";
import StoryEditor from "@/components/editor/story-editor";
import { booksAPI } from "@/lib/api/books";

export default function WriteChapterPage() {
  const router = useRouter();
  const params = useParams();
  const bookId = params?.bookId as string;
  const chapterId = params?.chapterId as string;

  const [book, setBook] = useState<API.BookDetail | null>(null);
  const [chapterTitle, setChapterTitle] = useState("");
  const [chapterContent, setChapterContent] = useState<any>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Load book on mount
  useEffect(() => {
    if (bookId) {
      booksAPI
        .getBook(bookId)
        .then(setBook)
        .catch((err) => {
          setErrors({
            submit: err?.message || "Failed to load story",
          });
        });
    }
  }, [bookId]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!chapterContent) {
      newErrors.content = "Chapter content is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveChapter = async (e: React.FormEvent, publish = false) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await booksAPI.createChapter(bookId, {
        title: chapterTitle.trim() || undefined,
        content: chapterContent,
      });

      // Navigate back to book view
      router.push(`/write/${bookId}`);
    } catch (error: any) {
      setErrors({
        submit:
          error?.response?.data?.message ||
          error?.message ||
          "Failed to save chapter",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!book) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-zinc-50">
        <AppHeader showBackButton onBack={() => router.back()} />
        <main className="pt-24 pb-16 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-flex h-8 w-8 animate-spin rounded-full border-4 border-zinc-300 border-t-orange-500" />
            <p className="mt-4 text-zinc-600">Loading story...</p>
          </div>
        </main>
      </div>
    );
  }

  const nextChapterNumber = (book.chapters?.length || 0) + 1;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-zinc-50">
      <AppHeader showBackButton onBack={() => router.back()} />

      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          {/* Page Header */}
          <div className="mb-8">
            <Link
              href={`/write/${bookId}`}
              className="text-sm text-zinc-500 hover:text-orange-600 transition-colors mb-4 inline-flex items-center gap-1"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to {book.title}
            </Link>

            <h1 className="text-3xl font-extrabold text-zinc-900 sm:text-4xl">
              Chapter {nextChapterNumber}
            </h1>
            <p className="mt-2 text-zinc-600">
              {book.title}
            </p>
          </div>

          {/* Error Messages */}
          {errors.submit && (
            <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4">
              <p className="text-sm text-red-700">{errors.submit}</p>
            </div>
          )}

          {/* Chapter Form */}
          <form onSubmit={(e) => handleSaveChapter(e, false)} className="space-y-8">
            {/* Chapter Title */}
            <div className="space-y-3">
              <label
                htmlFor="title"
                className="block text-sm font-semibold text-zinc-900"
              >
                Chapter Title (Optional)
              </label>
              <input
                type="text"
                id="title"
                value={chapterTitle}
                onChange={(e) => setChapterTitle(e.target.value)}
                placeholder={`e.g., "The Beginning" or leave blank for "Chapter ${nextChapterNumber}"`}
                className="w-full px-4 py-3 rounded-lg border border-zinc-200 bg-white text-lg transition-colors focus:border-orange-400 focus:ring-1 focus:ring-orange-100 focus:outline-none"
                disabled={isLoading}
              />
            </div>

            {/* Content Editor */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-zinc-900">
                Chapter Content *
              </label>
              <StoryEditor
                initialContent={chapterContent}
                onChange={setChapterContent}
                disabled={isLoading}
                placeholder="Start writing your chapter here... Use the toolbar to format your text."
              />
              {errors.content && (
                <p className="text-sm text-red-600">{errors.content}</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 rounded-lg bg-orange-500 text-white font-semibold hover:bg-orange-600 disabled:bg-zinc-300 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? "Saving..." : "Save Chapter"}
              </button>
              <Link
                href={`/write/${bookId}`}
                className="px-6 py-3 rounded-lg border border-zinc-200 bg-white text-zinc-900 font-semibold hover:bg-zinc-50 transition-colors"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
