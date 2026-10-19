"use client";

import Link from "next/link";
import { useState } from "react";
import { BookOpen, Eye, FileText, PenLine, Plus, SquarePen, Type } from "lucide-react";
import EmptyState, { ErrorState } from "@/components/ui/empty-state";

interface ProfileWritingSectionProps {
  books: API.AuthoredBook[];
  isLoading: boolean;
  isError?: boolean;
  onRetry?: () => void;
}

type FilterTab = "all" | "draft" | "published";

function formatWords(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  return n.toString();
}

function timeAgo(dateStr: string): string {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

/** Cover fallback: a brand-tinted tile with the title's initial. */
function CoverPlaceholder({ title }: { title: string }) {
  const initial = title.trim()[0]?.toUpperCase() ?? "?";
  return (
    <div className="flex h-full w-full items-center justify-center bg-brand-100">
      <span className="select-none text-4xl font-black text-brand-600/50">{initial}</span>
    </div>
  );
}

export default function ProfileWritingSection({ books, isLoading, isError, onRetry }: ProfileWritingSectionProps) {
  const [filter, setFilter] = useState<FilterTab>("all");

  const draftCount = books.filter((b) => b.status === "draft").length;
  const publishedCount = books.filter((b) => b.status === "published").length;
  const filtered = filter === "all" ? books : books.filter((b) => b.status === filter);

  const filterTabs: { id: FilterTab; label: string; count: number }[] = [
    { id: "all", label: "All", count: books.length },
    { id: "draft", label: "Drafts", count: draftCount },
    { id: "published", label: "Published", count: publishedCount },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="skeleton h-5 w-28 rounded-lg" />
          <div className="skeleton h-10 w-32 rounded-full" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="card overflow-hidden">
              <div className="skeleton h-32" />
              <div className="space-y-3 p-4">
                <div className="skeleton h-4 w-3/4 rounded" />
                <div className="skeleton h-3 w-full rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="card">
        <ErrorState
          title="Couldn't load your stories"
          description="We had trouble fetching your writing. Please try again."
          onRetry={onRetry}
        />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-zinc-950">Your stories</h2>
          <p className="mt-0.5 text-xs text-zinc-500">
            {books.length} {books.length === 1 ? "story" : "stories"}
            {draftCount > 0 && <span> · {draftCount} draft</span>}
            {publishedCount > 0 && <span className="font-semibold text-green-700"> · {publishedCount} published</span>}
          </p>
        </div>
        <Link href="/create-story" className="btn btn-primary btn-md flex-shrink-0">
          <Plus className="h-4 w-4" />
          New story
        </Link>
      </div>

      {books.length > 0 && (
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {filterTabs.map((tab) => (
            <button key={tab.id} type="button" onClick={() => setFilter(tab.id)} aria-pressed={filter === tab.id} className="chip">
              {tab.label}
              <span className="ml-1.5 text-[11px] opacity-70">{tab.count}</span>
            </button>
          ))}
        </div>
      )}

      {books.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={PenLine}
            title="No stories yet"
            description="Start your writing journey. Your first story is waiting to be told."
            action={
              <Link href="/create-story" className="btn btn-primary btn-md">
                Write your first story
              </Link>
            }
          />
        </div>
      ) : filtered.length === 0 ? (
        <div className="card">
          <EmptyState icon={BookOpen} title={`No ${filter} stories`} description="Nothing here yet." />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((book) => {
            const isPublished = book.status === "published";
            return (
              <article key={book.id} className="card card-interactive group overflow-hidden">
                <div className="relative h-32 overflow-hidden bg-zinc-100">
                  {book.cover_url ? (
                    <img
                      src={book.cover_url}
                      alt={book.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <CoverPlaceholder title={book.title} />
                  )}
                  <span
                    className={`badge absolute right-3 top-3 ${
                      isPublished ? "!bg-green-600 !text-white" : "!bg-zinc-900/80 !text-white"
                    }`}
                  >
                    {isPublished ? "Published" : "Draft"}
                  </span>
                </div>

                <div className="p-4">
                  <h3 className="line-clamp-1 font-bold leading-snug text-zinc-950">{book.title}</h3>
                  {book.description ? (
                    <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-zinc-600">{book.description}</p>
                  ) : (
                    <p className="mt-1 text-sm italic text-zinc-500">No description yet.</p>
                  )}

                  <div className="mt-3 flex items-center gap-3 text-xs text-zinc-500">
                    <span className="flex items-center gap-1">
                      <FileText className="h-3.5 w-3.5" />
                      {book.chapter_count} {book.chapter_count === 1 ? "ch" : "chs"}
                    </span>
                    {book.total_word_count > 0 && (
                      <span className="flex items-center gap-1">
                        <Type className="h-3.5 w-3.5" />
                        {formatWords(book.total_word_count)} words
                      </span>
                    )}
                    <span className="ml-auto text-zinc-400">{timeAgo(book.updated_at || book.created_at)}</span>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Link href={`/write/${book.slug}`} className="btn btn-dark min-h-9 flex-1 px-3 text-xs">
                      <SquarePen className="h-3.5 w-3.5" />
                      Manage
                    </Link>
                    <Link
                      href={`/write/${book.slug}/chapter/new`}
                      title="Add chapter"
                      className="btn btn-outline min-h-9 px-3 text-xs"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Chapter
                    </Link>
                    {isPublished && (
                      <Link
                        href={`/book/${book.slug}`}
                        title="View published story"
                        aria-label="View published story"
                        className="btn btn-outline min-h-9 w-9 !px-0"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Link>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
