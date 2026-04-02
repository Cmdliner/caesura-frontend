'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/header';
import { useBookQueries } from '@/lib/api/queries';
import { booksAPI } from '@/lib/api/books';
import { useAuth } from '@/app/providers/auth-provider';

const BOOKS_PER_PAGE = 20;

export default function DiscoverPage() {
  const { isAuthenticated } = useAuth();
  const [page, setPage] = useState(1);
  const [addingToLibrary, setAddingToLibrary] = useState<string | null>(null);

  const { data: booksData = { items: [], total_pages: 1 }, isLoading, error } = useBookQueries.useBooks(page);

  const handleAddToLibrary = async (bookId: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Please log in to add books to your library');
      return;
    }

    setAddingToLibrary(bookId);
    try {
      await booksAPI.addToLibrary(bookId);
      alert('Book added to your library!');
    } catch (err) {
      console.error('Failed to add book to library:', err);
      alert('Failed to add book to library');
    } finally {
      setAddingToLibrary(null);
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white pt-20 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-5xl font-bold text-zinc-900 tracking-tight">
              Discover Stories
            </h1>
            <p className="mt-4 text-lg text-zinc-600 max-w-2xl">
              Explore over <span className="font-semibold text-zinc-900">100+ books</span> from timeless classics to contemporary works. Find your next favorite read.
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {[...Array(15)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="bg-zinc-200 rounded-lg h-64 animate-pulse" />
                  <div className="h-4 bg-zinc-200 rounded animate-pulse" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="rounded-lg bg-red-50 border border-red-200 p-8 text-center">
              <p className="text-red-700 font-semibold">Error loading books</p>
              <p className="text-red-600 text-sm mt-2">Please try refreshing the page</p>
            </div>
          ) : booksData.items.length === 0 ? (
            <div className="rounded-lg bg-zinc-50 border border-zinc-200 p-12 text-center">
              <p className="text-zinc-600">No books available at the moment</p>
            </div>
          ) : (
            <>
              {/* Books Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                {booksData.items.map((book) => (
                  <Link href={`/book/${book.slug}`} key={book.id}>
                    <div className="group h-full flex flex-col rounded-lg overflow-hidden bg-white border border-zinc-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
                      {/* Book Cover */}
                      <div className="relative w-full bg-zinc-100 overflow-hidden" style={{ aspectRatio: '9/12' }}>
                        {book.cover_url ? (
                          <img
                            src={book.cover_url}
                            alt={book.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-orange-50">
                            <svg className="h-10 w-10 text-orange-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C6.5 6.253 2 10.998 2 17s4.5 10.747 10 10.747c5.5 0 10-4.999 10-11.747S17.5 6.253 12 6.253z" />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Book Info */}
                      <div className="flex flex-col flex-1 p-3">
                        <h3 className="font-semibold text-xs text-zinc-900 line-clamp-2 mb-1 leading-tight">
                          {book.title}
                        </h3>
                        
                        {/* Spacer */}
                        <div className="flex-1" />

                        {/* Footer */}
                        <div className="space-y-2">
                          {/* Stats */}
                          <div className="flex items-center gap-1 text-[10px] text-zinc-500">
                            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span>{Math.round(book.total_views / 1000)}K</span>
                          </div>

                          {/* Add Button */}
                          {isAuthenticated ? (
                            <button
                              onClick={(e) => handleAddToLibrary(book.id, e)}
                              disabled={addingToLibrary === book.id}
                              className={`w-full py-1.5 rounded text-[10px] font-semibold transition-all duration-200 ${
                                addingToLibrary === book.id
                                  ? 'bg-zinc-100 text-zinc-500 cursor-not-allowed'
                                  : 'bg-orange-500 text-white hover:bg-orange-600 active:scale-95'
                              }`}
                            >
                              {addingToLibrary === book.id ? 'Adding...' : '+ Add'}
                            </button>
                          ) : (
                            <Link
                              href="/login"
                              className="block w-full py-1.5 rounded bg-zinc-100 text-[10px] font-semibold text-zinc-700 text-center hover:bg-zinc-200 transition-colors"
                            >
                              Sign in
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {booksData.total_pages > 1 && (
                <div className="mt-16 flex items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      setPage(p => Math.max(1, p - 1));
                      window.scrollTo(0, 0);
                    }}
                    disabled={page === 1}
                    className="px-5 py-2 rounded-lg border border-zinc-300 bg-white text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    ← Previous
                  </button>

                  <div className="flex items-center gap-2">
                    {Array.from({ length: Math.min(booksData.total_pages, 7) }).map((_, i) => {
                      const pageNum = i + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => {
                            setPage(pageNum);
                            window.scrollTo(0, 0);
                          }}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            page === pageNum
                              ? 'bg-orange-500 text-white'
                              : 'border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => {
                      setPage(p => Math.min(booksData.total_pages, p + 1));
                      window.scrollTo(0, 0);
                    }}
                    disabled={page >= booksData.total_pages}
                    className="px-5 py-2 rounded-lg border border-zinc-300 bg-white text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next →
                  </button>
                </div>
              )}

              {/* Page Info */}
              <div className="mt-8 text-center text-sm text-zinc-600">
                Page {page} of {booksData.total_pages}
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}
