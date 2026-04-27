"use client";

import Link from "next/link";
import AppNav from "@/components/layout/app-nav";
import { useGenreQueries } from "@/lib/api/queries";

// ── Skeleton ─────────────────────────────────────────────────────────────────
function GenreSkeleton() {
  return (
    <div className="rounded-2xl border border-zinc-100 bg-white p-6 animate-pulse">
      <div className="h-5 w-2/3 bg-zinc-100 rounded mb-3" />
      <div className="h-3 w-1/3 bg-zinc-50 rounded" />
    </div>
  );
}

// ── Genre card ────────────────────────────────────────────────────────────────
function GenreCard({ genre }: { genre: API.Genre }) {
  return (
    <Link
      href={`/genres/${genre.slug}`}
      className="group flex items-center justify-between rounded-2xl border border-zinc-100 bg-white px-6 py-5 hover:border-zinc-300 hover:shadow-sm active:scale-[0.98] transition-all"
    >
      <div>
        <p className="text-[15px] font-bold text-zinc-900 group-hover:text-zinc-700 transition-colors">
          {genre.name}
        </p>
        <p className="mt-0.5 text-[12px] text-zinc-400 tabular-nums">
          {genre.book_count.toLocaleString()}{" "}
          {genre.book_count === 1 ? "story" : "stories"}
        </p>
      </div>
      <svg
        className="h-4 w-4 text-zinc-300 group-hover:text-zinc-500 group-hover:translate-x-0.5 transition-all flex-shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function GenresPage() {
  const { data: genres = [], isLoading, error } = useGenreQueries.useGenres();

  const withBooks = genres.filter((g) => g.book_count > 0);
  const empty = genres.filter((g) => g.book_count === 0);

  return (
    <>
      <AppNav />
      <main className="min-h-screen bg-white pt-[60px] page-enter">
        {/* Header */}
        <div className="border-b border-zinc-100">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10 animate-fade-up">
            <h1 className="text-[28px] sm:text-[34px] font-extrabold text-zinc-900 tracking-tight">
              Browse by Genre
            </h1>
            <p className="mt-2 text-[15px] text-zinc-500">
              Find stories in the genres you love.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Array.from({ length: 12 }).map((_, i) => (
                <GenreSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            <div className="rounded-2xl bg-red-50 border border-red-100 p-10 text-center">
              <p className="text-red-700 font-semibold text-sm">Failed to load genres</p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="cursor-pointer mt-4 px-4 py-2 rounded-xl bg-zinc-900 text-white text-sm font-semibold hover:bg-zinc-700 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : genres.length === 0 ? (
            <div className="rounded-2xl bg-zinc-50 border border-zinc-100 p-14 text-center">
              <p className="text-zinc-500 font-semibold text-sm">No genres yet</p>
            </div>
          ) : (
            <div className="space-y-8 animate-fade-up">
              {/* Genres that have books */}
              {withBooks.length > 0 && (
                <section>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {withBooks.map((genre) => (
                      <GenreCard key={genre.id} genre={genre} />
                    ))}
                  </div>
                </section>
              )}

              {/* Genres with no books yet — shown as a muted footer row */}
              {empty.length > 0 && (
                <section>
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-300 mb-3">
                    Coming soon
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {empty.map((genre) => (
                      <span
                        key={genre.id}
                        className="px-3 py-1.5 rounded-full border border-zinc-100 text-[12px] text-zinc-400 font-medium"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
