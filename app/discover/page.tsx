'use client';

import { useState, useRef } from 'react';
import { ArrowRight, CircleAlert, BookOpen } from "lucide-react";
import PageHero from "@/components/ui/page-hero";
import EmptyState, { ErrorState } from "@/components/ui/empty-state";
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

        <PageHero
          compact
          title="Browse"
          containerClassName="mx-auto max-w-[1400px] px-4 sm:px-6"
          description={
            <>
              {activeGenre ? `Stories in ${activeGenre.name}` : 'Discover stories from emerging and classic authors'}
              {booksData && booksData.total > 0 && (
                <span className="ml-2 text-zinc-500">· {booksData.total.toLocaleString()} stories</span>
              )}
            </>
          }
          actions={
            activeGenre ? (
              <Link href={`/genres/${activeGenre.slug}`} className="btn btn-outline btn-md hidden sm:inline-flex">
                Full genre page
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : undefined
          }
        >
          {genres.length > 0 && (
            <div ref={pillsRef} className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
              <button type="button" onClick={() => handleSelectGenre(null)} aria-pressed={!activeGenre} className="chip">
                All
              </button>
              {genres.map((genre) => (
                <button
                  key={genre.id}
                  type="button"
                  onClick={() => handleSelectGenre(genre)}
                  aria-pressed={activeGenre?.id === genre.id}
                  className="chip"
                >
                  {genre.name}
                </button>
              ))}
            </div>
          )}
        </PageHero>

        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 pt-6">
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-5 gap-y-9">
              {Array.from({ length: 18 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : error ? (
            <ErrorState title="Failed to load stories" description="Please check your connection and try again." />
          ) : items.length === 0 ? (
            <EmptyState
              icon={BookOpen}
              title={activeGenre ? `No stories in ${activeGenre.name} yet` : 'No stories available yet'}
              description={activeGenre ? 'Be the first to write one.' : 'Check back soon or start writing your own.'}
              action={
                <Link href="/create-story" className="btn btn-primary btn-md">
                  Start writing
                  <ArrowRight className="h-4 w-4" />
                </Link>
              }
            />
          ) : (
            <>
              <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-5 gap-y-9 transition-opacity duration-200 ${isFetching ? 'opacity-60' : 'opacity-100'} animate-fade-up`}>
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
