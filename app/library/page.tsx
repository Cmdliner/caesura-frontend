"use client";

import Link from "next/link";
import { CircleAlert, LayoutGrid, Library as LibraryIcon, List } from "lucide-react";
import PageHero from "@/components/ui/page-hero";
import EmptyState, { ErrorState } from "@/components/ui/empty-state";
import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Drawer } from "vaul";
import AppNav from "@/components/layout/app-nav";
import BookCard from "@/components/books/book-card";
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
        <PageHero
          compact
          title="Library"
          description={`${books.length} ${books.length === 1 ? "book" : "books"} saved`}
          containerClassName="mx-auto max-w-[1200px] px-4 sm:px-6"
          actions={
            <>
              <div className="flex max-w-full items-center gap-2 overflow-x-auto scrollbar-hide">
                {filters.map((f) => (
                  <button key={f.id} type="button" onClick={() => setFilter(f.id)} aria-pressed={filter === f.id} className="chip">
                    {f.label}
                    {counts[f.id] > 0 && <span className="ml-1.5 text-[11px] opacity-70">{counts[f.id]}</span>}
                  </button>
                ))}
              </div>
              <div className="flex flex-shrink-0 items-center gap-1 rounded-full border border-zinc-300 bg-white p-1">
                <button
                  type="button"
                  onClick={() => setLayout("grid")}
                  aria-label="Grid view"
                  aria-pressed={layout === "grid"}
                  className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${layout === "grid" ? "bg-zinc-900 text-white" : "text-zinc-500 hover:text-zinc-900"}`}
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setLayout("list")}
                  aria-label="List view"
                  aria-pressed={layout === "list"}
                  className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${layout === "list" ? "bg-zinc-900 text-white" : "text-zinc-500 hover:text-zinc-900"}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </>
          }
        />

        {/* Body */}
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 pt-6">
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
            <ErrorState title="Failed to load your library" />
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={LibraryIcon}
              title={filter === "all" ? "Your library is empty" : `No ${filter} books`}
              description="Discover and save stories to read them here."
              action={
                <Link href="/discover" className="btn btn-primary btn-md">
                  Browse stories
                </Link>
              }
            />
          ) : layout === "grid" ? (
            /* ── Grid view ── */
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-5 gap-y-9 animate-fade-up">
              {filtered.map((book) => (
                <BookCard
                  key={book.book_id}
                  id={book.book_id}
                  slug={book.slug}
                  title={book.title}
                  cover_url={book.cover_url}
                  total_views={book.total_views}
                  variant="cover"
                  overlayAction="read"
                  progress={book.progress?.scroll_position}
                  meta={
                    book.progress
                      ? `${Math.round(book.progress.scroll_position)}% · ${formatLastRead(book.progress.last_read_at)}`
                      : "Saved"
                  }
                />
              ))}
            </div>
          ) : (
            /* ── List view ── */
            <div className="card divide-y divide-zinc-100 overflow-hidden animate-fade-up">
              {filtered.map((book) => (
                <button
                  key={book.book_id}
                  type="button"
                  onClick={() => setActiveBook(book)}
                  className="group flex w-full items-center gap-4 px-4 py-3.5 text-left transition-colors hover:bg-zinc-50"
                >
                  {/* Cover */}
                  <div className="relative w-12 flex-shrink-0 overflow-hidden rounded-md shadow-sm ring-1 ring-black/5" style={{ aspectRatio: "2/3" }}>
                    {book.cover_url ? (
                      <img src={book.cover_url} alt="" className="w-full h-full object-cover" loading="lazy" />
                    ) : (
                      <div className="h-full w-full bg-brand-100" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[14px] text-zinc-900 truncate">{book.title}</h3>
                    {book.progress ? (
                      <div className="mt-1.5">
                        <div className="h-1.5 w-full max-w-[220px] overflow-hidden rounded-full bg-zinc-100">
                          <div className="h-full rounded-full bg-brand-600" style={{ width: `${book.progress.scroll_position}%` }} />
                        </div>
                        <p className="text-[11px] text-zinc-400 mt-1">
                          {Math.round(book.progress.scroll_position)}% · {formatLastRead(book.progress.last_read_at)}
                        </p>
                      </div>
                    ) : (
                      <p className="text-[12px] text-zinc-400 mt-0.5 capitalize">{book.shelf}</p>
                    )}
                  </div>

                  <span className="btn btn-outline min-h-8 flex-shrink-0 px-3.5 text-xs">
                    {book.progress ? "Continue" : "Read"}
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
                      <div className="badge badge-neutral mt-2 capitalize">
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
                        <div className="h-full rounded-full bg-brand-600" style={{ width: `${activeBook.progress.scroll_position}%` }} />
                      </div>
                      <p className="mt-2 text-xs text-zinc-500">Last read {formatLastRead(activeBook.progress.last_read_at)}</p>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-auto">
                    <Link
                      href={`/book/${activeBook.slug}`}
                      className="btn btn-primary btn-lg flex-1"
                    >
                      {activeBook.progress ? "Continue reading" : "Start reading"}
                    </Link>
                    <Drawer.Close asChild>
                      <button
                        type="button"
                        className="btn btn-outline btn-lg flex-1"
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
