'use client';

import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import AppNav from '@/components/layout/app-nav';
import BookCard from '@/components/books/book-card';
import { useBookQueries } from '@/lib/api/queries';
import { booksAPI } from '@/lib/api/books';
import { useAuth } from '@/app/providers/auth-provider';

function getPaginationPages(current: number, total: number): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | '…')[] = [];
  const left = current - 2;
  const right = current + 2;

  if (left > 2) pages.push(1, '…');
  else for (let i = 1; i < Math.min(left, 2); i++) pages.push(i);

  for (let i = Math.max(1, left); i <= Math.min(total, right); i++) pages.push(i);

  if (right < total - 1) pages.push('…', total);
  else for (let i = Math.max(right + 1, total); i <= total; i++) pages.push(i);

  return pages.filter((p, i) => p !== pages[i - 1]);
}

export default function DiscoverPage() {
  const { isAuthenticated } = useAuth();
  const [page, setPage] = useState(1);
  const [addingToLibrary, setAddingToLibrary] = useState<string | null>(null);

  const { data: booksData = { items: [], total_pages: 1 }, isLoading, error } = useBookQueries.useBooks(page);

  const handleAddToLibrary = async (bookId: string, bookTitle: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Sign in to save stories', {
        description: 'Create a free account to build your library.',
        action: { label: 'Sign in', onClick: () => window.location.href = '/login' },
      });
      return;
    }

    setAddingToLibrary(bookId);
    const toastId = toast.loading('Adding to library…');
    try {
      await booksAPI.addToLibrary(bookId);
      toast.success('Added to your library!', {
        id: toastId,
        description: bookTitle,
        icon: '📚',
      });
    } catch (err) {
      console.error('Failed to add book to library:', err);
      toast.error('Could not add to library', {
        id: toastId,
        description: 'Please try again.',
      });
    } finally {
      setAddingToLibrary(null);
    }
  };

  const goToPage = (p: number) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const pages = getPaginationPages(page, booksData.total_pages);

  return (
    <>
      <AppNav />
      <main className="min-h-screen bg-white pt-15 pb-16 page-enter">
        {/* Page Header */}
        <div className="border-b border-zinc-100 bg-white">
          <div className="mx-auto max-w-300 px-4 sm:px-6 py-8 animate-fade-up">
            <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">Browse</h1>
            <p className="mt-1.5 text-[15px] text-zinc-500">
              Discover stories from emerging and classic authors
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-300 px-4 sm:px-6 pt-8">
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-7">
              {[...Array(18)].map((_, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <div className="skeleton rounded-lg" style={{ aspectRatio: '2/3' }} />
                  <div className="skeleton h-3 rounded w-3/4" />
                  <div className="skeleton h-3 rounded w-1/2" style={{ animationDelay: '0.1s' }} />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="rounded-xl bg-red-50 border border-red-100 p-10 text-center animate-fade-up">
              <p className="text-red-700 font-semibold text-sm">Failed to load books</p>
              <p className="text-red-500 text-xs mt-1">Please try refreshing the page</p>
            </div>
          ) : booksData.items.length === 0 ? (
            <div className="rounded-xl bg-zinc-50 border border-zinc-100 p-16 text-center animate-fade-up">
              <p className="text-zinc-500 text-sm">No books available at the moment</p>
              <Link href="/" className="mt-4 inline-block text-sm font-semibold text-orange-500 hover:underline">Go home</Link>
            </div>
          ) : (
            <>
              {/* Books Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-7 animate-fade-up">
                {booksData.items.map((book) => (
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

              {/* Pagination */}
              {booksData.total_pages > 1 && (
                <div className="mt-14 flex flex-col items-center gap-4 animate-fade-up">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => goToPage(page - 1)}
                      disabled={page === 1}
                      aria-label="Previous page"
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-500 hover:border-zinc-400 hover:text-zinc-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>

                    {pages.map((p, i) =>
                      p === '…' ? (
                        <span key={`ellipsis-${i}`} className="flex h-9 w-9 items-center justify-center text-sm text-zinc-400 select-none">…</span>
                      ) : (
                        <button
                          key={p}
                          onClick={() => goToPage(p as number)}
                          className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-semibold transition-all hover:scale-105 active:scale-95 ${
                            page === p
                              ? 'bg-orange-500 text-white shadow-sm shadow-orange-200'
                              : 'border border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400 hover:text-zinc-900'
                          }`}
                        >
                          {p}
                        </button>
                      )
                    )}

                    <button
                      onClick={() => goToPage(page + 1)}
                      disabled={page >= booksData.total_pages}
                      aria-label="Next page"
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-500 hover:border-zinc-400 hover:text-zinc-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>

                  <p className="text-xs text-zinc-400">
                    Page <span className="font-semibold text-zinc-600">{page}</span> of{' '}
                    <span className="font-semibold text-zinc-600">{booksData.total_pages}</span>
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </>
  );
}
