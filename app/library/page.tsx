"use client";

import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Drawer } from "vaul";
import Header from "@/components/layout/header";
import { useAuthQuery } from "@/lib/api/queries";
import { useAuth } from "@/app/providers/auth-provider";
import { formatLastRead } from "@/lib/utils";

interface BookItem extends API.LibraryItem {
  shelf: "reading" | "saved" | "finished";
}

const filters = [
  { id: "all", label: "All Books" },
  { id: "reading", label: "Currently Reading" },
  { id: "saved", label: "Want to Read" },
  { id: "finished", label: "Finished" },
] as const;

type FilterId = (typeof filters)[number]["id"];

export default function LibraryPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [filter, setFilter] = useState<FilterId>("reading");
  const [activeBook, setActiveBook] = useState<BookItem | null>(null);
  const [layout, setLayout] = useState<"grid" | "list">("grid");

  // Fetch library data
  const { data: libraryItems = [], isLoading, error } = useAuthQuery.useLibrary();

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, authLoading, router]);

  // Transform API data to ui format with mock shelf status
  const books: BookItem[] = useMemo(() => {
    return libraryItems.map((item) => ({
      ...item,
      shelf: item.progress 
        ? (item.progress.scroll_position >= 90 ? "finished" : "reading" as const)
        : ("saved" as const),
    }));
  }, [libraryItems]);

  const filtered = useMemo(() => {
    if (filter === "all") return books;
    return books.filter((b) => b.shelf === filter);
  }, [filter, books]);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-white to-zinc-50 pt-20 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-extrabold text-zinc-900 sm:text-5xl">
              My Library
            </h1>
            <p className="mt-4 text-lg text-zinc-600">
              {filtered.length} {filtered.length === 1 ? "book" : "books"}
            </p>
          </div>

          {/* Filters */}
          <div className="mb-8 flex flex-wrap items-center gap-3">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  filter === f.id
                    ? "bg-orange-500 text-white shadow-lg"
                    : "bg-white border border-zinc-200 text-zinc-700 hover:border-zinc-300"
                }`}
              >
                {f.label}
              </button>
            ))}
            <div className="ml-auto flex gap-2">
              <button
                onClick={() => setLayout("grid")}
                className={`p-2.5 rounded-lg border transition-all ${
                  layout === "grid"
                    ? "bg-zinc-900 text-white border-zinc-900"
                    : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300"
                }`}
                title="Grid view"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM15 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2h-2zM5 13a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM15 13a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2h-2z" />
                </svg>
              </button>
              <button
                onClick={() => setLayout("list")}
                className={`p-2.5 rounded-lg border transition-all ${
                  layout === "list"
                    ? "bg-zinc-900 text-white border-zinc-900"
                    : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300"
                }`}
                title="List view"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="bg-zinc-200 rounded-lg h-80 animate-pulse" />
              ))}
            </div>
          ) : error ? (
            <div className="rounded-lg bg-red-50 border border-red-200 p-8 text-center">
              <p className="text-red-700 font-semibold">Failed to load library</p>
              <p className="text-red-600 text-sm mt-2">Please try refreshing the page</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-lg bg-zinc-50 border border-zinc-200 p-12 text-center">
              <svg className="h-16 w-16 text-zinc-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C6.5 6.253 2 10.998 2 17s4.5 10.747 10 10.747c5.5 0 10-4.999 10-11.747S17.5 6.253 12 6.253z" />
              </svg>
              <p className="text-zinc-600 font-medium mb-4">No books yet</p>
              <Link
                href="/discover"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-orange-500 text-white font-medium hover:bg-orange-600 transition-colors"
              >
                Discover stories
              </Link>
            </div>
          ) : layout === "grid" ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filtered.map((book) => (
                <Link
                  key={book.book_id}
                  href={`/book/${book.slug}`}
                  className="group flex flex-col rounded-xl bg-white border border-zinc-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Cover */}
                  <div className="relative bg-zinc-100 overflow-hidden" style={{ aspectRatio: '3/4' }}>
                    {book.cover_url ? (
                      <img
                        src={book.cover_url}
                        alt={book.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-orange-50">
                        <svg className="h-12 w-12 text-orange-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C6.5 6.253 2 10.998 2 17s4.5 10.747 10 10.747c5.5 0 10-4.999 10-11.747S17.5 6.253 12 6.253z" />
                        </svg>
                      </div>
                    )}
                    {/* Badge */}
                    {book.progress && (
                      <div className="absolute top-2 right-2 px-2 py-1 rounded-full bg-black/70 text-white text-[10px] font-bold">
                        {Math.round(book.progress.scroll_position)}%
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-3 flex-1 flex flex-col">
                    <h3 className="font-semibold text-sm text-zinc-900 line-clamp-2 mb-2">
                      {book.title}
                    </h3>
                    {book.progress && (
                      <>
                        <div className="mb-2 h-1.5 bg-zinc-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-orange-500 rounded-full"
                            style={{ width: `${book.progress.scroll_position}%` }}
                          />
                        </div>
                        <p className="text-xs text-zinc-500 mb-3">
                          {formatLastRead(book.progress.last_read_at)}
                        </p>
                      </>
                    )}
                    <button
                      className="mt-auto px-3 py-2 rounded-lg bg-orange-500 text-white text-xs font-semibold transition-colors hover:bg-orange-600 active:scale-95"
                      onClick={(e) => {
                        e.preventDefault();
                      }}
                    >
                      Continue Reading
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((book) => (
                <button
                  key={book.book_id}
                  type="button"
                  onClick={() => setActiveBook(book)}
                  className="group w-full flex gap-4 p-4 rounded-xl bg-white border border-zinc-200 text-left hover:border-orange-200 hover:shadow-md transition-all"
                >
                  {/* Cover */}
                  <div className="relative w-16 h-24 flex-shrink-0 rounded-lg bg-zinc-100 overflow-hidden">
                    {book.cover_url ? (
                      <img
                        src={book.cover_url}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-orange-50">
                        <svg className="h-6 w-6 text-orange-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C6.5 6.253 2 10.998 2 17s4.5 10.747 10 10.747c5.5 0 10-4.999 10-11.747S17.5 6.253 12 6.253z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className="font-semibold text-zinc-900 truncate">
                        {book.title}
                      </h3>
                      <span className="flex-shrink-0 px-3 py-1 rounded-full bg-zinc-100 text-xs font-medium text-zinc-600 capitalize">
                        {book.shelf}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-500 truncate mb-3">
                      {book.slug}
                    </p>
                    {book.progress && (
                      <>
                        <div className="mb-2 h-1 bg-zinc-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-orange-500"
                            style={{ width: `${book.progress.scroll_position}%` }}
                          />
                        </div>
                        <p className="text-xs text-zinc-500">
                          {book.progress.scroll_position}% • {formatLastRead(book.progress.last_read_at)}
                        </p>
                      </>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Book Details Drawer */}
        <Drawer.Root open={activeBook !== null} onOpenChange={(open) => !open && setActiveBook(null)}>
          <Drawer.Portal>
            <Drawer.Overlay className="fixed inset-0 z-60 bg-black/35" />
            <Drawer.Content className="fixed bottom-0 left-0 right-0 z-70 mx-auto flex max-h-[80dvh] max-w-lg flex-col rounded-t-3xl bg-white">
              <div className="mx-auto mt-3 h-1 w-12 rounded-full bg-zinc-200" />
              {activeBook && (
                <div className="flex flex-1 flex-col overflow-y-auto px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4 sm:px-6">
                  <div className="flex gap-4 mb-6">
                    {activeBook.cover_url && (
                      <img
                        src={activeBook.cover_url}
                        alt=""
                        className="h-32 w-24 flex-shrink-0 rounded-lg object-cover shadow"
                      />
                    )}
                    <div className="flex-1">
                      <Drawer.Title className="text-2xl font-bold text-zinc-900">
                        {activeBook.title}
                      </Drawer.Title>
                      <p className="mt-2 text-sm text-zinc-500">
                        {activeBook.slug}
                      </p>
                      <div className="mt-3 inline-block px-3 py-1 rounded-full bg-zinc-100 text-xs font-semibold text-zinc-700 capitalize">
                        {activeBook.shelf}
                      </div>
                    </div>
                  </div>

                  {activeBook.progress && (
                    <div className="mb-6 p-4 rounded-lg bg-zinc-50 border border-zinc-200">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-medium text-zinc-900">Reading Progress</span>
                        <span className="text-sm font-semibold text-orange-600">{activeBook.progress.scroll_position}%</span>
                      </div>
                      <div className="h-2 bg-zinc-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-orange-500 rounded-full"
                          style={{ width: `${activeBook.progress.scroll_position}%` }}
                        />
                      </div>
                      <p className="mt-3 text-xs text-zinc-600">
                        Last read {formatLastRead(activeBook.progress.last_read_at)}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-3 mt-auto">
                    <Link
                      href={`/book/${activeBook.slug}`}
                      className="flex-1 inline-flex items-center justify-center px-4 py-3 rounded-lg bg-zinc-900 text-white font-semibold hover:bg-orange-500 transition-colors"
                    >
                      Continue Reading
                    </Link>
                    <Drawer.Close asChild>
                      <button
                        type="button"
                        className="flex-1 inline-flex items-center justify-center px-4 py-3 rounded-lg border border-zinc-200 text-zinc-700 font-semibold hover:bg-zinc-50 transition-colors"
                      >
                        Close
                      </button>
                    </Drawer.Close>
                  </div>
                </div>
              )}
            </Drawer.Content>
          </Drawer.Portal>
        </Drawer.Root>
      </main>
    </>
  );
}
