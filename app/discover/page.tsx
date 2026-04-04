'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/header';
import BookCard from '@/components/books/book-card';
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
                {booksData.items.map((book) => (
                  <BookCard
                    key={book.id}
                    id={book.id}
                    slug={book.slug}
                    title={book.title}
                    description={book.description}
                    cover_url={book.cover_url}
                    total_views={book.total_views}
                    variant="featured"
                    isAuthenticated={isAuthenticated}
                    author={book.authors?.length ? book.authors[0] : book.author_name || 'Unknown Author'}
                    isAddingToLibrary={addingToLibrary === book.id}
                    onAddToLibrary={(e) => handleAddToLibrary(book.id, e)}
                  />
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
