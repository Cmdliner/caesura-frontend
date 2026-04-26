"use client";

import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Drawer } from "vaul";
import AppNav from "@/components/layout/app-nav";
import { useAuthQuery } from "@/lib/api/queries";
import { useAuth } from "@/app/providers/auth-provider";
import { formatLastRead } from "@/lib/utils";

interface BookItem extends API.LibraryItem {
  shelf: "reading" | "saved" | "finished";
}

const filters = [
  { id: "all", label: "All" },
  { id: "reading", label: "Reading" },
  { id: "saved", label: "Want to Read" },
  { id: "finished", label: "Finished" },
] as const;

type FilterId = (typeof filters)[number]["id"];

export default function LibraryPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [filter, setFilter] = useState<FilterId>("all");
  const [activeBook, setActiveBook] = useState<BookItem | null>(null);
  const [layout, setLayout] = useState<"grid" | "list">("grid");

  const { data: libraryItems = [], isLoading, error } = useAuthQuery.useLibrary();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, authLoading, router]);

  const books: BookItem[] = useMemo(() => {
    return libraryItems.map((item) => ({
      ...item,
      shelf: item.progress
        ? item.progress.scroll_position >= 90
          ? "finished"
          : "reading"
        : ("saved" as const),
    }));
  }, [libraryItems]);

  const filtered = useMemo(() => {
    if (filter === "all") return books;
    return books.filter((b) => b.shelf === filter);
  }, [filter, books]);

  const counts = useMemo(
    () => ({
      all: books.length,
      reading: books.filter((b) => b.shelf === "reading").length,
      saved: books.filter((b) => b.shelf === "saved").length,
      finished: books.filter((b) => b.shelf === "finished").length,
    }),
    [books]
  );

  return (
    <>
      <AppNav />
      <main className="min-h-screen bg-white pt-[60px] pb-16 page-enter">
        {/* Page header */}
        <div className="border-b border-zinc-100">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
            {/* Title */}
            <div className="pt-8 pb-5 animate-fade-up">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">Library</h1>
              <p className="mt-1 text-[12px] sm:text-[14px] text-zinc-500">
                {books.length} {books.length === 1 ? "book" : "books"} saved
              </p>
            </div>

            {/* Filter tabs (Wattpad-style underline) - scrollable on mobile */}
            <div className="flex items-center gap-0 -mb-px overflow-x-auto scrollbar-hide">
              {filters.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={`relative px-2 sm:px-4 py-3 text-[12px] sm:text-[13.5px] font-semibold transition-colors whitespace-nowrap flex-shrink-0 ${
                    filter === f.id
                      ? "text-zinc-900 border-b-[2.5px] border-zinc-900"
                      : "text-zinc-500 hover:text-zinc-800 border-b-[2.5px] border-transparent"
                  }`}
                >
                  {f.label}
                  {counts[f.id] > 0 && (
                    <span className={`ml-1.5 text-[11px] font-medium ${filter === f.id ? "text-zinc-900" : "text-zinc-400"}`}>
                      {counts[f.id]}
                    </span>
                  )}
                </button>
              ))}

              {/* Layout toggles — push right */}
              <div className="ml-auto flex items-center gap-1.5 pb-1">
                <button
                  onClick={() => setLayout("grid")}
                  className={`p-2 rounded-lg transition-colors ${layout === "grid" ? "bg-zinc-900 text-white" : "text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100"}`}
                  title="Grid view"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM15 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2h-2zM5 13a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM15 13a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2h-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setLayout("list")}
                  className={`p-2 rounded-lg transition-colors ${layout === "list" ? "bg-zinc-900 text-white" : "text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100"}`}
                  title="List view"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 pt-8">
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-7">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <div className="skeleton rounded-lg" style={{ aspectRatio: "2/3" }} />
                  <div className="skeleton h-3 rounded w-3/4" />
                  <div className="skeleton h-3 rounded w-1/2" style={{ animationDelay: '0.1s' }} />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="rounded-xl bg-red-50 border border-red-100 p-10 text-center">
              <p className="text-red-700 font-semibold text-sm">Failed to load library</p>
              <p className="text-red-500 text-xs mt-1">Please try refreshing the page</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="h-16 w-16 rounded-2xl bg-zinc-100 flex items-center justify-center mb-4">
                <svg className="h-8 w-8 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <p className="text-zinc-600 font-semibold text-sm">
                {filter === "all" ? "Your library is empty" : `No ${filter} books`}
              </p>
              <p className="text-zinc-400 text-xs mt-1">Discover and save stories to read them here</p>
              <Link
                href="/discover"
                className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-800 text-white text-sm font-semibold hover:bg-zinc-700 transition-colors"
              >
                Browse stories
              </Link>
            </div>
          ) : layout === "grid" ? (
            /* ── Grid view ── */
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-7 animate-fade-up">
              {filtered.map((book) => (
                <div key={book.book_id} className="group flex flex-col gap-2">
                  {/* Cover */}
                  <Link
                    href={`/book/${book.slug}`}
                    className="relative block rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    style={{ aspectRatio: "2/3" }}
                  >
                    {book.cover_url ? (
                      <img
                        src={book.cover_url}
                        alt={book.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-200 px-3 text-center">
                        <span className="text-xs font-semibold text-zinc-500 line-clamp-3 leading-tight">{book.title}</span>
                      </div>
                    )}
                    {/* Progress badge */}
                    {book.progress && (
                      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-black/20">
                        <div
                          className="h-full bg-zinc-800"
                          style={{ width: `${book.progress.scroll_position}%` }}
                        />
                      </div>
                    )}
                    {/* Hover: continue reading */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-end justify-center pb-3 opacity-0 group-hover:opacity-100">
                      <span className="px-3 py-1 rounded-full bg-white text-zinc-900 text-[11px] font-bold shadow">
                        {book.progress ? "Continue" : "Read"}
                      </span>
                    </div>
                  </Link>

                  {/* Metadata */}
                  <div className="min-w-0">
                    <Link href={`/book/${book.slug}`}>
                      <h3 className="text-[13px] font-semibold text-zinc-900 line-clamp-2 leading-tight hover:text-zinc-600 transition-colors">
                        {book.title}
                      </h3>
                    </Link>
                    {book.progress && (
                      <p className="text-[11px] text-zinc-400 mt-0.5">
                        {Math.round(book.progress.scroll_position)}% · {formatLastRead(book.progress.last_read_at)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* ── List view ── */
            <div className="divide-y divide-zinc-100 animate-fade-up">
              {filtered.map((book) => (
                <button
                  key={book.book_id}
                  type="button"
                  onClick={() => setActiveBook(book)}
                  className="group w-full flex items-center gap-4 py-4 text-left hover:bg-zinc-50 rounded-lg px-2 -mx-2 transition-colors"
                >
                  {/* Cover */}
                  <div className="relative flex-shrink-0 w-12 rounded overflow-hidden shadow-sm" style={{ aspectRatio: "2/3" }}>
                    {book.cover_url ? (
                      <img src={book.cover_url} alt="" className="w-full h-full object-cover" loading="lazy" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-zinc-100 to-zinc-200" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[14px] text-zinc-900 truncate">{book.title}</h3>
                    {book.progress ? (
                      <div className="mt-1.5">
                        <div className="h-1 bg-zinc-100 rounded-full overflow-hidden w-full max-w-[200px]">
                          <div className="h-full bg-zinc-800 rounded-full" style={{ width: `${book.progress.scroll_position}%` }} />
                        </div>
                        <p className="text-[11px] text-zinc-400 mt-1">
                          {Math.round(book.progress.scroll_position)}% · {formatLastRead(book.progress.last_read_at)}
                        </p>
                      </div>
                    ) : (
                      <p className="text-[12px] text-zinc-400 mt-0.5 capitalize">{book.shelf}</p>
                    )}
                  </div>

                  <span className="flex-shrink-0 text-xs font-semibold text-zinc-900 group-hover:underline hidden sm:block">
                    {book.progress ? "Continue" : "Read"} →
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Book Details Drawer */}
        <Drawer.Root open={activeBook !== null} onOpenChange={(open) => !open && setActiveBook(null)}>
          <Drawer.Portal>
            <Drawer.Overlay className="fixed inset-0 z-60 bg-black/35" />
            <Drawer.Content className="fixed bottom-0 left-0 right-0 z-70 mx-auto flex max-h-[90dvh] w-full max-w-lg flex-col rounded-t-2xl sm:rounded-t-3xl bg-white">
              <div className="mx-auto mt-2 sm:mt-3 h-1 w-10 sm:w-12 rounded-full bg-zinc-200" />
              {activeBook && (
                <div className="flex flex-1 flex-col overflow-y-auto px-4 sm:px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-3 sm:pt-4">
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
                    {activeBook.cover_url && (
                      <img
                        src={activeBook.cover_url}
                        alt=""
                        className="h-24 sm:h-32 w-16 sm:w-24 flex-shrink-0 rounded-lg object-cover shadow"
                      />
                    )}
                    <div className="flex-1">
                      <Drawer.Title className="text-lg sm:text-xl font-bold text-zinc-900 line-clamp-2">
                        {activeBook.title}
                      </Drawer.Title>
                      <div className="mt-2 inline-block px-2.5 py-1 rounded-full bg-zinc-100 text-[11px] sm:text-xs font-semibold text-zinc-600 capitalize">
                        {activeBook.shelf}
                      </div>
                    </div>
                  </div>

                  {activeBook.progress && (
                    <div className="mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-zinc-50 border border-zinc-100">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-semibold text-zinc-900">Reading Progress</span>
                        <span className="text-sm font-bold text-zinc-900">{activeBook.progress.scroll_position}%</span>
                      </div>
                      <div className="h-2 bg-zinc-200 rounded-full overflow-hidden">
                        <div className="h-full bg-zinc-800 rounded-full" style={{ width: `${activeBook.progress.scroll_position}%` }} />
                      </div>
                      <p className="mt-2 text-xs text-zinc-500">Last read {formatLastRead(activeBook.progress.last_read_at)}</p>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-auto">
                    <Link
                      href={`/book/${activeBook.slug}`}
                      className="flex-1 inline-flex items-center justify-center px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl bg-zinc-900 text-white font-semibold text-sm hover:bg-zinc-800 transition-colors"
                    >
                      Continue Reading
                    </Link>
                    <Drawer.Close asChild>
                      <button
                        type="button"
                        className="flex-1 inline-flex items-center justify-center px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border border-zinc-200 text-zinc-700 font-semibold text-sm hover:bg-zinc-50 transition-colors"
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
