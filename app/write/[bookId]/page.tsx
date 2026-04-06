"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import AppHeader from "@/components/layout/app-header";
import { booksAPI } from "@/lib/api/books";

export default function BookWritePage() {
  const router = useRouter();
  const params = useParams();
  const bookSlug = params?.bookId as string;

  const [book, setBook] = useState<API.BookDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (bookSlug) {
      booksAPI
        .getAuthoredBook(bookSlug)
        .then(setBook)
        .catch((err) => {
          setError(err?.message || "Failed to load story");
        })
        .finally(() => setIsLoading(false));
    }
  }, [bookSlug]);

  if (isLoading) {
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

  if (error || !book) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-zinc-50">
        <AppHeader showBackButton onBack={() => router.back()} />
        <main className="pt-24 pb-16">
          <div className="mx-auto max-w-2xl px-4 sm:px-6">
            <div className="rounded-lg bg-red-50 border border-red-200 p-6 text-center">
              <p className="text-red-700 font-semibold">{error || "Story not found"}</p>
              <Link
                href="/write/create"
                className="mt-4 inline-block text-orange-600 hover:underline"
              >
                Create a new story →
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const totalWords = book.chapters?.reduce(
    (sum, ch) => sum + (ch.word_count || 0),
    0
  ) || 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-zinc-50">
      <AppHeader showBackButton onBack={() => router.back()} />

      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          {/* Book Header */}
          <div className="mb-8">
            <Link
              href="/create-story"
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
              New Story
            </Link>

            <h1 className="text-4xl font-extrabold text-zinc-900 sm:text-5xl">
              {book.title}
            </h1>
            {book.description && (
              <p className="mt-2 text-lg text-zinc-600">{book.description}</p>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 rounded-lg border border-zinc-200 bg-white p-4 mb-8">
            <div className="text-center">
              <p className="text-2xl font-bold text-zinc-900">
                {book.chapters?.length || 0}
              </p>
              <p className="text-xs uppercase text-zinc-600 font-semibold mt-1">
                Chapters
              </p>
            </div>
            <div className="border-l border-r border-zinc-200 text-center">
              <p className="text-2xl font-bold text-zinc-900">{totalWords}</p>
              <p className="text-xs uppercase text-zinc-600 font-semibold mt-1">
                Words
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-zinc-900">
                {new Date(book.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </p>
              <p className="text-xs uppercase text-zinc-600 font-semibold mt-1">
                Created
              </p>
            </div>
          </div>

          {/* Chapters List */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-zinc-900 mb-4">
              Chapters
            </h2>

            {book.chapters && book.chapters.length > 0 ? (
              <div className="space-y-3">
                {book.chapters.map((chapter) => (
                  <div
                    key={chapter.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-zinc-200 hover:border-orange-300 hover:bg-orange-50 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-zinc-900">
                        Chapter {chapter.chapter_number}
                        {chapter.title && `: ${chapter.title}`}
                      </p>
                      <p className="text-sm text-zinc-600 mt-1">
                        {chapter.word_count || 0} words
                        {chapter.published_at && (
                          <>
                            {" "}
                            · Published{" "}
                            {new Date(chapter.published_at).toLocaleDateString()}
                          </>
                        )}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={`/write/${book.slug}/chapter/${chapter.chapter_number}`}
                        className="px-4 py-2 rounded-lg bg-orange-100 text-orange-600 font-medium hover:bg-orange-200 transition-colors"
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-8 text-center">
                <p className="text-zinc-600 font-medium">No chapters yet</p>
                <p className="text-sm text-zinc-500 mt-1">
                  Start writing your first chapter
                </p>
              </div>
            )}
          </div>

          {/* Add Chapter Button */}
          <Link
            href={`/write/${book.slug}/chapter/new`}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-colors"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add New Chapter
          </Link>

          {/* Navigation */}
          <div className="mt-8 pt-8 border-t border-zinc-200">
            <Link
              href="/profile"
              className="text-sm text-zinc-600 hover:text-orange-600 transition-colors"
            >
              ← Back to Profile
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
