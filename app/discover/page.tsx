'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import AppNav from '@/components/layout/app-nav';
import BookCard from '@/components/books/book-card';
import { useBookQueries, useGenreQueries } from '@/lib/api/queries';
import { genresAPI } from '@/lib/api/genres';
import { booksAPI } from '@/lib/api/books';
import { useAuth } from '@/app/providers/auth-provider';
import { useQuery } from '@tanstack/react-query';
import { APP_CONFIG } from '@/lib/constants';

// ── Pagination ────────────────────────────────────────────────────────────────
function getPaginationPages(current: number, total: number): (number | '…')[] {
  if (total <= 1) return total === 1 ? [1] : [];
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | '…')[] = [1];
  const windowStart = Math.max(2, current - 1);
  const windowEnd = Math.min(total - 1, current + 1);
  if (windowStart > 2) pages.push('…');
  for (let i = windowStart; i <= windowEnd; i++) pages.push(i);
  if (windowEnd < total - 1) pages.push('…');
  pages.push(total);
  return pages;
}

function SkeletonCard() {
  return (
    <div className="flex flex-col gap-2">
      <div className="skeleton rounded-xl w-full" style={{ aspectRatio: '2/3' }} />
      <div className="skeleton h-3 rounded w-3/4" />
      <div className="skeleton h-3 rounded w-1/2" style={{ animationDelay: '0.1s' }} />
    </div>
  );
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
  const base = 'flex h-9 min-w-[36px] items-center justify-center rounded-lg text-sm font-semibold transition-all hover:scale-105 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 px-2';
  const btnIdle = `${base} border border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400 hover:text-zinc-900`;
  const btnActive = `${base} bg-zinc-900 text-white shadow-sm`;
  return (
    <div className="mt-14 flex flex-col items-center gap-3 animate-fade-up">
      <div className="flex items-center gap-1">
        <button type="button" onClick={() => onPageChange(page - 1)} disabled={page <= 1} className={btnIdle}>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        {pages.map((p, i) =>
          p === '…' ? (
            <span key={`ellipsis-${i}`} className="flex h-9 w-9 items-center justify-center text-sm text-zinc-400 select-none">…</span>
          ) : (
            <button key={p} type="button" onClick={() => onPageChange(p as number)} aria-current={page === p ? 'page' : undefined} className={page === p ? btnActive : btnIdle}>{p}</button>
          )
        )}
        <button type="button" onClick={() => onPageChange(page + 1)} disabled={page >= totalPages} className={btnIdle}>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      <p className="text-xs text-zinc-400">
        Page <span className="font-semibold text-zinc-600">{page}</span> of{' '}
        <span className="font-semibold text-zinc-600">{totalPages}</span>
      </p>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function DiscoverPage() {
  const { isAuthenticated } = useAuth();
  const [page, setPage] = useState(1);
  const [activeGenre, setActiveGenre] = useState<API.Genre | null>(null);
  const [addingToLibrary, setAddingToLibrary] = useState<string | null>(null);
  const pillsRef = useRef<HTMLDivElement>(null);

  // Genres list for filter pills
  const { data: genres = [] } = useGenreQueries.useGenres();

  // Books — either all books or genre-filtered
  const allBooksQuery = useBookQueries.useBooks(page);
  const genreBooksQuery = useQuery({
    queryKey: ['genre-books', activeGenre?.slug, page],
    queryFn: () => genresAPI.getGenreBooks(activeGenre!.slug, page),
    enabled: !!activeGenre,
    staleTime: APP_CONFIG.STALE_TIME,
    gcTime: APP_CONFIG.CACHE_TIME,
  });

  const activeQuery = activeGenre ? genreBooksQuery : allBooksQuery;
  const { isLoading, error, isFetching } = activeQuery;
  const booksData = activeQuery.data;
  const totalPages = booksData?.total_pages ?? 0;
  const items = booksData?.items ?? [];

  const handleSelectGenre = (genre: API.Genre | null) => {
    setActiveGenre(genre);
    setPage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToLibrary = async (bookId: string, bookTitle: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Sign in to save stories', {
        description: 'Create a free account to build your library.',
        action: { label: 'Sign in', onClick: () => { window.location.href = '/login'; } },
      });
      return;
    }
    setAddingToLibrary(bookId);
    const toastId = toast.loading('Adding to library…');
    try {
      await booksAPI.addToLibrary(bookId);
      toast.success('Added to your library!', { id: toastId, description: bookTitle });
    } catch {
      toast.error('Could not add to library', { id: toastId, description: 'Please try again.' });
    } finally {
      setAddingToLibrary(null);
    }
  };

  const goToPage = (p: number) => {
    const clamped = Math.max(1, totalPages > 0 ? Math.min(p, totalPages) : p);
    if (clamped === page) return;
    setPage(clamped);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <AppNav />
      <main className="min-h-screen bg-white pt-15 pb-20 page-enter">

        {/* Header */}
        <div className="border-b border-zinc-100 bg-white">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 py-8 animate-fade-up">
            <div className="flex items-baseline justify-between gap-4">
              <div>
                <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">Browse</h1>
                <p className="mt-1.5 text-[15px] text-zinc-500">
                  {activeGenre
                    ? `Stories in ${activeGenre.name}`
                    : 'Discover stories from emerging and classic authors'}
                  {booksData && booksData.total > 0 && (
                    <span className="ml-2 text-zinc-400">· {booksData.total.toLocaleString()} stories</span>
                  )}
                </p>
              </div>
              {activeGenre && (
                <Link
                  href={`/genres/${activeGenre.slug}`}
                  className="flex-shrink-0 text-[12px] font-semibold text-zinc-500 hover:text-zinc-900 underline underline-offset-2 transition-colors hidden sm:block"
                >
                  See full genre page →
                </Link>
              )}
            </div>

            {/* Genre filter pills */}
            {genres.length > 0 && (
              <div
                ref={pillsRef}
                className="mt-5 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide"
              >
                {/* "All" pill */}
                <button
                  type="button"
                  onClick={() => handleSelectGenre(null)}
                  className={`cursor-pointer flex-shrink-0 px-4 py-1.5 rounded-full text-[12.5px] font-semibold transition-all active:scale-95 ${
                    !activeGenre
                      ? 'bg-zinc-900 text-white'
                      : 'border border-zinc-200 text-zinc-600 hover:border-zinc-400 hover:text-zinc-900'
                  }`}
                >
                  All
                </button>

                {genres.map((genre) => (
                  <button
                    key={genre.id}
                    type="button"
                    onClick={() => handleSelectGenre(genre)}
                    className={`cursor-pointer flex-shrink-0 px-4 py-1.5 rounded-full text-[12.5px] font-semibold transition-all active:scale-95 ${
                      activeGenre?.id === genre.id
                        ? 'bg-zinc-900 text-white'
                        : 'border border-zinc-200 text-zinc-600 hover:border-zinc-400 hover:text-zinc-900'
                    }`}
                  >
                    {genre.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 pt-8">
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-7">
              {Array.from({ length: 18 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : error ? (
            <div className="rounded-2xl bg-red-50 border border-red-100 p-12 text-center animate-fade-up">
              <p className="text-red-700 font-semibold">Failed to load stories</p>
              <p className="text-red-500 text-sm mt-1">Please try refreshing the page.</p>
              <button type="button" onClick={() => window.location.reload()} className="mt-4 px-4 py-2 rounded-xl bg-zinc-900 text-white text-sm font-semibold hover:bg-zinc-700 transition-colors">
                Retry
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="rounded-2xl bg-zinc-50 border border-zinc-100 p-16 text-center animate-fade-up">
              <p className="text-zinc-500 font-semibold">
                {activeGenre ? `No stories in ${activeGenre.name} yet` : 'No stories available yet'}
              </p>
              <p className="text-zinc-400 text-sm mt-1">
                {activeGenre ? 'Be the first to write one.' : 'Check back soon or start writing your own.'}
              </p>
              <Link href="/create-story" className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 text-white text-sm font-semibold hover:bg-zinc-700 transition-colors">
                Start writing →
              </Link>
            </div>
          ) : (
            <>
              <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-7 transition-opacity duration-200 ${isFetching ? 'opacity-60' : 'opacity-100'} animate-fade-up`}>
                {items.map((book) => (
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
                    author={book.authors?.length ? book.authors[0] : book.author_name || 'Unknown Author'}
                    isAddingToLibrary={addingToLibrary === book.id}
                    onAddToLibrary={(e) => handleAddToLibrary(book.id, book.title, e)}
                  />
                ))}
              </div>
              <Pagination page={page} totalPages={totalPages} onPageChange={goToPage} />
            </>
          )}
        </div>
      </main>
    </>
  );
}
