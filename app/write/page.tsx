"use client";

import { useEffect } from "react";
import { ChevronRight, PenLine, Plus } from "lucide-react";
import PageHero from "@/components/ui/page-hero";
import EmptyState from "@/components/ui/empty-state";
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
        <PageHero
          eyebrow="Writer studio"
          title="My stories"
          description="Manage your writing projects."
          containerClassName="mx-auto max-w-[1000px] px-4 sm:px-6"
          actions={
            <Link href="/create-story" className="btn btn-primary btn-md">
              <Plus className="h-4 w-4" />
              New story
            </Link>
          }
        />

        <div className="mx-auto max-w-[1000px] px-4 sm:px-6 pt-8">
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="skeleton h-20 rounded-xl" />
              ))}
            </div>
          ) : books.length === 0 ? (
            <EmptyState
              icon={PenLine}
              title="Start your first story"
              description="Every great author started somewhere. Write the story only you can tell."
              action={
                <Link href="/create-story" className="btn btn-primary btn-lg">
                  <Plus className="h-4 w-4" />
                  Create new story
                </Link>
              }
            />
          ) : (
            <div className="space-y-3 animate-fade-up">
              {books.map((book) => (
                <Link
                  key={book.id}
                  href={`/write/${book.slug}`}
                  className="group card card-interactive flex items-center gap-4 p-4"
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
                      <span className={`badge ${book.status === "published" ? "badge-success" : "badge-neutral"}`}>
                        {book.status === "published" ? "Published" : "Draft"}
                      </span>
                      <span className="text-xs text-zinc-400">
                        {new Date(book.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                    </div>
                  </div>

                  <ChevronRight className="h-5 w-5 flex-shrink-0 text-zinc-300 transition-colors group-hover:text-brand-600" />
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
