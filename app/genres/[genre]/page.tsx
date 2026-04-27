"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import AppNav from "@/components/layout/app-nav";
import BookCard from "@/components/books/book-card";
import { useGenreQueries } from "@/lib/api/queries";
import { booksAPI } from "@/lib/api/books";
import { useAuth } from "@/app/providers/auth-provider";
import { toast } from "sonner";

// ── Helpers ───────────────────────────────────────────────────────────────────

/** "science-fiction" → "Science Fiction" */
function slugToLabel(slug: string) {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

// ── Pagination ────────────────────────────────────────────────────────────────
function getPaginationPages(current: number, total: number): (number | "…")[] {
  if (total <= 1) return total === 1 ? [1] : [];
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | "…")[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  if (start > 2) pages.push("…");
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < total - 1) pages.push("…");
  pages.push(total);
  return pages;
}

function Pagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}) {
  if (totalPages <= 1) return null;
  const pages = getPaginationPages(page, totalPages);
  const base = "flex h-9 min-w-[36px] items-center justify-center rounded-lg text-sm font-semibold transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed px-2";
  const idle = `${base} border border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400`;
  const active = `${base} bg-zinc-900 text-white`;
  return (
    <div className="mt-14 flex flex-col items-center gap-3">
      <div className="flex items-center gap-1">
        <button type="button" onClick={() => onPageChange(page - 1)} disabled={page <= 1} className={idle}>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        {pages.map((p, i) =>
          p === "…" ? (
            <span key={`e${i}`} className="flex h-9 w-9 items-center justify-center text-sm text-zinc-400">…</span>
          ) : (
            <button key={p} type="button" onClick={() => onPageChange(p as number)} className={page === p ? active : idle}>
              {p}
            </button>
          )
        )}
        <button type="button" onClick={() => onPageChange(page + 1)} disabled={page >= totalPages} className={idle}>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      <p className="text-xs text-zinc-400">
        Page <span className="font-semibold text-zinc-600">{page}</span> of{" "}
        <span className="font-semibold text-zinc-600">{totalPages}</span>
      </p>
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="flex flex-col gap-2">
      <div className="skeleton rounded-xl w-full" style={{ aspectRatio: "2/3" }} />
      <div className="skeleton h-3 rounded w-3/4" />
      <div className="skeleton h-3 rounded w-1/2" style={{ animationDelay: "0.1s" }} />
    </div>
  );
}

// ── Featured book (top-picks row) ─────────────────────────────────────────────
function FeaturedBook({
  book,
  rank,
  isAuthenticated,
  onAddToLibrary,
  isAdding,
}: {
  book: API.BookSummary;
  rank: number;
  isAuthenticated: boolean;
  onAddToLibrary: (e: React.MouseEvent) => void;
  isAdding: boolean;
}) {
  return (
    <Link
      href={`/book/${book.slug}`}
      className="group flex gap-4 rounded-2xl border border-zinc-100 bg-white p-4 hover:border-zinc-200 hover:shadow-sm active:scale-[0.99] transition-all"
    >
      {/* Cover */}
      <div className="flex-shrink-0 w-[72px] rounded-xl overflow-hidden bg-zinc-100" style={{ aspectRatio: "2/3" }}>
        {book.cover_url ? (
          <img src={book.cover_url} alt={book.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="h-6 w-6 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
        <div>
          <div className="flex items-start gap-2 mb-1">
            <span className="flex-shrink-0 text-[11px] font-black text-zinc-200 tabular-nums mt-0.5">
              #{rank}
            </span>
            <p className="text-[14px] font-bold text-zinc-900 leading-snug line-clamp-2 group-hover:text-zinc-700 transition-colors">
              {book.title}
            </p>
          </div>
          <p className="text-[12px] text-zinc-400 truncate">
            {book.authors?.length ? book.authors[0] : book.author_name || "Unknown Author"}
          </p>
          {book.description && (
            <p className="mt-1.5 text-[12px] text-zinc-500 line-clamp-2 leading-relaxed">
              {book.description}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between mt-2">
          <span className="text-[11px] text-zinc-400 tabular-nums">
            {book.total_views.toLocaleString()} reads
          </span>
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); onAddToLibrary(e); }}
            disabled={isAdding}
            className="cursor-pointer text-[11px] font-semibold text-zinc-500 hover:text-zinc-900 active:scale-95 transition-all"
          >
            {isAdding ? "Adding…" : "+ Library"}
          </button>
        </div>
      </div>
    </Link>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function GenreDetailPage() {
  const params = useParams();
  const genreSlug = params?.genre as string;
  const { isAuthenticated } = useAuth();

  const [page, setPage] = useState(1);
  const [addingToLibrary, setAddingToLibrary] = useState<string | null>(null);

  const { data, isLoading, error, isFetching } = useGenreQueries.useGenreBooks(genreSlug, page);

  const items = data?.items ?? [];
  const totalPages = data?.total_pages ?? 0;
  const total = data?.total ?? 0;

  // First page: split into top-6 featured + the rest as grid
  const isFirstPage = page === 1;
  const topPicks = isFirstPage ? items.slice(0, 6) : [];
  const gridItems = isFirstPage ? items.slice(6) : items;

  const handleAddToLibrary = async (bookId: string, title: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("Sign in to save stories", {
        action: { label: "Sign in", onClick: () => { window.location.href = "/login"; } },
      });
      return;
    }
    setAddingToLibrary(bookId);
    const id = toast.loading("Adding to library…");
    try {
      await booksAPI.addToLibrary(bookId);
      toast.success("Added!", { id, description: title });
    } catch {
      toast.error("Could not add to library", { id });
    } finally {
      setAddingToLibrary(null);
    }
  };

  const goToPage = (p: number) => {
    const clamped = Math.max(1, totalPages > 0 ? Math.min(p, totalPages) : p);
    if (clamped === page) return;
    setPage(clamped);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const genreLabel = slugToLabel(genreSlug ?? "");

  return (
    <>
      <AppNav />
      <main className="min-h-screen bg-white pt-[60px] page-enter">
        {/* Header */}
        <div className="border-b border-zinc-100">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-6 py-10 animate-fade-up">
            <Link
              href="/genres"
              className="inline-flex items-center gap-1 text-[13px] text-zinc-400 hover:text-zinc-700 transition-colors mb-5"
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              All genres
            </Link>
            <h1 className="text-[28px] sm:text-[34px] font-extrabold text-zinc-900 tracking-tight">
              {genreLabel}
            </h1>
            {!isLoading && total > 0 && (
              <p className="mt-1.5 text-[15px] text-zinc-500">
                {total.toLocaleString()} {total === 1 ? "story" : "stories"}
              </p>
            )}
          </div>
        </div>

        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 py-10">
          {isLoading ? (
            <div className="space-y-10">
              {/* Top picks skeleton */}
              <section>
                <div className="h-4 w-24 bg-zinc-100 rounded mb-5 animate-pulse" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="rounded-2xl border border-zinc-100 bg-white p-4 flex gap-4 animate-pulse">
                      <div className="w-[72px] rounded-xl bg-zinc-100" style={{ aspectRatio: "2/3" }} />
                      <div className="flex-1 space-y-2 py-1">
                        <div className="h-3 bg-zinc-100 rounded w-3/4" />
                        <div className="h-3 bg-zinc-50 rounded w-1/2" />
                        <div className="h-3 bg-zinc-50 rounded w-full" />
                        <div className="h-3 bg-zinc-50 rounded w-2/3" />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          ) : error ? (
            <div className="rounded-2xl bg-red-50 border border-red-100 p-12 text-center">
              <p className="text-red-700 font-semibold text-sm">
                {(error as any)?.response?.status === 404
                  ? `No genre found for "${genreLabel}"`
                  : "Failed to load stories"}
              </p>
              <Link
                href="/genres"
                className="mt-4 inline-block text-sm text-zinc-500 hover:text-zinc-900 underline underline-offset-2 transition-colors"
              >
                ← Browse all genres
              </Link>
            </div>
          ) : items.length === 0 ? (
            <div className="rounded-2xl bg-zinc-50 border border-zinc-100 p-16 text-center">
              <p className="text-zinc-500 font-semibold text-sm">No stories in this genre yet</p>
              <p className="text-zinc-400 text-sm mt-1">Be the first to write one.</p>
              <Link
                href="/create-story"
                className="mt-5 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-zinc-900 text-white text-sm font-semibold hover:bg-zinc-700 active:scale-95 transition-all"
              >
                Start writing →
              </Link>
            </div>
          ) : (
            <div className={`space-y-12 transition-opacity duration-200 ${isFetching ? "opacity-60" : ""}`}>
              {/* Top picks (first 6, first page only) */}
              {topPicks.length > 0 && (
                <section>
                  <div className="flex items-center gap-3 mb-5">
                    <h2 className="text-[13px] font-bold uppercase tracking-widest text-zinc-400">
                      Top Picks
                    </h2>
                    <div className="flex-1 h-px bg-zinc-100" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {topPicks.map((book, i) => (
                      <FeaturedBook
                        key={book.id}
                        book={book}
                        rank={i + 1}
                        isAuthenticated={isAuthenticated}
                        onAddToLibrary={(e) => handleAddToLibrary(book.id, book.title, e)}
                        isAdding={addingToLibrary === book.id}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* Rest as cover grid */}
              {gridItems.length > 0 && (
                <section>
                  {isFirstPage && topPicks.length > 0 && (
                    <div className="flex items-center gap-3 mb-5">
                      <h2 className="text-[13px] font-bold uppercase tracking-widest text-zinc-400">
                        More Stories
                      </h2>
                      <div className="flex-1 h-px bg-zinc-100" />
                    </div>
                  )}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-7">
                    {gridItems.map((book) => (
                      <BookCard
                        key={book.id}
                        id={book.id}
                        slug={book.slug}
                        title={book.title}
                        description={book.description}
                        cover_url={book.cover_url}
                        total_views={book.total_views}
                        variant="cover"
                        isAuthenticated={isAuthenticated}
                        author={book.authors?.length ? book.authors[0] : book.author_name || "Unknown Author"}
                        isAddingToLibrary={addingToLibrary === book.id}
                        onAddToLibrary={(e) => handleAddToLibrary(book.id, book.title, e)}
                      />
                    ))}
                  </div>
                </section>
              )}

              <Pagination page={page} totalPages={totalPages} onPageChange={goToPage} />
            </div>
          )}
        </div>
      </main>
    </>
  );
}
