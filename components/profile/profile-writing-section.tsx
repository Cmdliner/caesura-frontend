"use client";

import Link from "next/link";
import { useState } from "react";

interface ProfileWritingSectionProps {
  books: API.AuthoredBook[];
  isLoading: boolean;
}

export default function ProfileWritingSection({
  books,
  isLoading,
}: ProfileWritingSectionProps) {
  const [selectedBook, setSelectedBook] = useState<API.AuthoredBook | null>(null);

  const draftBooks = books.filter((b) => b.status === "draft");
  const publishedBooks = books.filter((b) => b.status === "published");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-zinc-900">Your Books</h2>
          <p className="text-sm text-zinc-500 mt-0.5">
            {books.length} {books.length === 1 ? "book" : "books"} • {draftBooks.length} draft • {publishedBooks.length} published
          </p>
        </div>
        <Link
          href="/create-story"
          className="inline-flex items-center justify-center rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 transition-colors flex-shrink-0"
        >
          <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Book
        </Link>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="rounded-lg border border-zinc-200 bg-white overflow-hidden">
          <div className="flex justify-center py-12">
            <div className="inline-flex h-8 w-8 animate-spin rounded-full border-[3px] border-zinc-200 border-t-orange-500" />
          </div>
        </div>
      ) : books.length === 0 ? (
        /* Empty State */
        <div className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-8 text-center">
          <svg className="h-12 w-12 mx-auto text-zinc-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
          <h3 className="text-sm font-semibold text-zinc-900">No books yet</h3>
          <p className="mt-1 text-sm text-zinc-600">Start your writing journey by creating your first book.</p>
          <Link
            href="/create-story"
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 transition-colors"
          >
            Create your first book →
          </Link>
        </div>
      ) : (
        /* Books List */
        <div className="rounded-lg border border-zinc-200 bg-white overflow-hidden shadow-sm">
          <div className="divide-y divide-zinc-100">
            {books.map((book) => (
              <div
                key={book.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 sm:p-5 hover:bg-zinc-50 transition-colors group"
              >
                {/* Book Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-3">
                    {book.cover_url && (
                      <img
                        src={book.cover_url}
                        alt={book.title}
                        className="h-12 w-9 sm:h-14 sm:w-10 rounded object-cover flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-zinc-900 text-[14px] sm:text-base truncate">
                        {book.title}
                      </h3>
                      {book.description && (
                        <p className="text-xs sm:text-sm text-zinc-600 mt-1 line-clamp-2">
                          {book.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <span
                          className={`inline-flex px-2 py-1 rounded-full text-[10px] font-semibold ${
                            book.status === "published"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-yellow-50 text-yellow-700"
                          }`}
                        >
                          {book.status === "published" ? "Published" : "Draft"}
                        </span>
                        <span className="text-xs text-zinc-500">
                          {new Date(book.created_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 flex-shrink-0">
                  <Link
                    href={`/write/${book.slug}`}
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-zinc-100 text-zinc-700 text-[13px] font-semibold hover:bg-zinc-200 transition-colors"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Edit
                  </Link>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center p-2 rounded-lg text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition-colors"
                    title="More options"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.5 1.5H9.5V.5h1v1zm0 17H9.5v1h1v-1zm8-8.5v1h-1v-1h1zM1.5 10.5h-1v-1h1v1z" />
                      <circle cx="10" cy="10" r="1.5" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
