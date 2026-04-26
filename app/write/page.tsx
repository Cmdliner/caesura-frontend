"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import AppNav from "@/components/layout/app-nav";
import Footer from "@/components/layout/footer";
import { booksAPI } from "@/lib/api/books";
import { useAuth } from "@/app/providers/auth-provider";
import { tokenManager } from "@/lib/utils";

export default function WritePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!tokenManager.hasToken()) {
      router.push("/login");
    }
  }, [router]);

  const { data: books = [], isLoading } = useQuery({
    queryKey: ["authored-books"],
    queryFn: () => booksAPI.getAuthoredBooks(),
    enabled: isAuthenticated,
  });

  return (
    <>
      <AppNav />
      <main className="min-h-screen bg-[#f8f8f8] pt-[60px] pb-16 page-enter">
        {/* Header */}
        <div className="bg-white border-b border-zinc-100">
          <div className="mx-auto max-w-[1000px] px-4 sm:px-6 py-8 flex items-center justify-between gap-4">
            <div className="animate-fade-up">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">My Stories</h1>
              <p className="mt-1 text-sm text-zinc-500">Manage your writing projects</p>
            </div>
            <Link
              href="/create-story"
              className="flex-shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 transition-colors animate-fade-up"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Story
            </Link>
          </div>
        </div>

        <div className="mx-auto max-w-[1000px] px-4 sm:px-6 pt-8">
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="skeleton h-20 rounded-xl" />
              ))}
            </div>
          ) : books.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-up">
              <div className="h-20 w-20 rounded-2xl bg-orange-50 flex items-center justify-center mb-5">
                <svg className="h-10 w-10 text-orange-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-zinc-900">Start your first story</h2>
              <p className="text-zinc-500 text-sm mt-1 max-w-xs">
                Every great author started somewhere. Write the story only you can tell.
              </p>
              <Link
                href="/create-story"
                className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-colors"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create New Story
              </Link>
            </div>
          ) : (
            <div className="space-y-3 animate-fade-up">
              {books.map((book) => (
                <Link
                  key={book.id}
                  href={`/write/${book.slug}`}
                  className="group flex items-center gap-4 p-4 rounded-2xl bg-white border border-zinc-200 hover:border-orange-200 hover:shadow-sm transition-all"
                >
                  {/* Cover placeholder */}
                  <div
                    className="flex-shrink-0 w-10 h-14 rounded-lg overflow-hidden bg-gradient-to-br from-orange-100 to-amber-50 flex items-center justify-center"
                  >
                    <svg className="h-5 w-5 text-orange-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-zinc-900 truncate group-hover:text-orange-600 transition-colors">
                      {book.title}
                    </h3>
                    {book.description && (
                      <p className="text-sm text-zinc-500 truncate mt-0.5">{book.description}</p>
                    )}
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                        book.status === "published"
                          ? "bg-green-50 text-green-700"
                          : "bg-zinc-100 text-zinc-500"
                      }`}>
                        {book.status === "published" ? "Published" : "Draft"}
                      </span>
                      <span className="text-xs text-zinc-400">
                        {new Date(book.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                    </div>
                  </div>

                  <svg className="h-5 w-5 text-zinc-300 group-hover:text-orange-400 transition-colors flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
