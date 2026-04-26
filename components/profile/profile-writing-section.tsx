"use client";

import Link from "next/link";
import { useState } from "react";

interface ProfileWritingSectionProps {
  books: API.AuthoredBook[];
  isLoading: boolean;
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

const COVER_PALETTES = [
  "bg-slate-800",
  "bg-zinc-700",
  "bg-stone-700",
  "bg-neutral-700",
  "bg-gray-700",
];

function CoverPlaceholder({ title }: { title: string }) {
  const idx = title.charCodeAt(0) % COVER_PALETTES.length;
  const initial = title.trim()[0]?.toUpperCase() ?? "?";
  return (
    <div className={`w-full h-full ${COVER_PALETTES[idx]} flex items-center justify-center`}>
      <span className="text-2xl font-black text-white/20 select-none">{initial}</span>
    </div>
  );
}

export default function ProfileWritingSection({ books, isLoading }: ProfileWritingSectionProps) {
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
          <div className="h-5 w-28 rounded-lg bg-zinc-200 animate-pulse" />
          <div className="h-9 w-28 rounded-xl bg-zinc-200 animate-pulse" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-2xl border border-zinc-200 bg-white overflow-hidden shadow-sm">
              <div className="h-28 skeleton" />
              <div className="p-4 space-y-3">
                <div className="h-4 w-3/4 rounded bg-zinc-100 animate-pulse" />
                <div className="h-3 w-full rounded bg-zinc-100 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-[17px] font-bold text-zinc-900">Your Stories</h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            {books.length} {books.length === 1 ? "story" : "stories"}
            {draftCount > 0 && <span> · {draftCount} draft</span>}
            {publishedCount > 0 && (
              <span className="text-emerald-600 font-semibold"> · {publishedCount} published</span>
            )}
          </p>
        </div>
        <Link
          href="/create-story"
          className="cursor-pointer inline-flex items-center gap-1.5 rounded-xl bg-zinc-900 px-4 py-2.5 text-[13px] font-semibold text-white hover:bg-zinc-700 active:scale-[0.97] transition-all flex-shrink-0 shadow-sm"
        >
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          New Story
        </Link>
      </div>

      {/* Filter tabs */}
      {books.length > 0 && (
        <div className="flex gap-1 p-1 bg-zinc-100 rounded-xl w-fit">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id)}
              className={`cursor-pointer px-3.5 py-1.5 rounded-lg text-[12.5px] font-semibold transition-all active:scale-[0.97] ${
                filter === tab.id
                  ? "bg-white text-zinc-900 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-700 hover:bg-zinc-50"
              }`}
            >
              {tab.label}
              <span className={`ml-1.5 text-[11px] ${
                filter === tab.id ? "text-zinc-600" : "text-zinc-400"
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Empty state */}
      {books.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-zinc-200 bg-white p-10 text-center">
          <div className="mx-auto mb-4 h-14 w-14 rounded-2xl bg-zinc-100 flex items-center justify-center">
            <svg className="h-7 w-7 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <h3 className="text-[15px] font-bold text-zinc-800">No stories yet</h3>
          <p className="mt-1.5 text-sm text-zinc-500 max-w-xs mx-auto leading-relaxed">
            Start your writing journey. Your first story is waiting to be told.
          </p>
          <Link
            href="/create-story"
            className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 text-white text-sm font-semibold hover:bg-zinc-700 active:scale-95 transition-all shadow-sm"
          >
            Write your first story →
          </Link>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl bg-white border border-zinc-200 p-8 text-center shadow-sm">
          <p className="text-sm text-zinc-400">No {filter} stories.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((book) => {
            const isPublished = book.status === "published";
            return (
              <article
                key={book.id}
                className="group relative rounded-2xl border border-zinc-200 bg-white overflow-hidden shadow-sm hover:shadow-md hover:border-zinc-300 transition-all duration-200"
              >
                {/* Cover */}
                <div className="relative h-28 overflow-hidden bg-zinc-100">
                  {book.cover_url ? (
                    <img
                      src={book.cover_url}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <CoverPlaceholder title={book.title} />
                  )}
                  {/* Status badge — semantic colors */}
                  <span className={`absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[10.5px] font-bold tracking-wide ${
                    isPublished
                      ? "bg-emerald-500 text-white shadow-sm"
                      : "bg-zinc-800/80 text-zinc-300"
                  }`}>
                    {isPublished ? "Published" : "Draft"}
                  </span>
                </div>

                {/* Body */}
                <div className="p-4">
                  <h3 className="font-bold text-zinc-900 text-[14.5px] leading-snug line-clamp-1 group-hover:text-zinc-600 transition-colors">
                    {book.title}
                  </h3>
                  {book.description ? (
                    <p className="mt-1 text-[12.5px] text-zinc-500 line-clamp-2 leading-relaxed">
                      {book.description}
                    </p>
                  ) : (
                    <p className="mt-1 text-[12.5px] text-zinc-400 italic">No description yet.</p>
                  )}

                  {/* Stats row */}
                  <div className="mt-3 flex items-center gap-3 text-[11.5px] text-zinc-400">
                    <span className="flex items-center gap-1">
                      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      {book.chapter_count} {book.chapter_count === 1 ? "ch" : "chs"}
                    </span>
                    {book.total_word_count > 0 && (
                      <span className="flex items-center gap-1">
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                        </svg>
                        {formatWords(book.total_word_count)} words
                      </span>
                    )}
                    <span className="ml-auto text-zinc-300">{timeAgo(book.updated_at || book.created_at)}</span>
                  </div>

                  {/* Actions */}
                  <div className="mt-3.5 flex gap-2">
                    <Link
                      href={`/write/${book.slug}`}
                      className="cursor-pointer flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-zinc-900 text-white text-[12px] font-semibold hover:bg-zinc-700 active:scale-[0.97] transition-all"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      Manage
                    </Link>
                    <Link
                      href={`/write/${book.slug}/chapter/new`}
                      className="cursor-pointer inline-flex items-center justify-center gap-1 px-3 py-2 rounded-lg border border-zinc-200 text-zinc-600 text-[12px] font-semibold hover:border-zinc-400 hover:bg-zinc-50 active:scale-[0.97] transition-all"
                      title="Add chapter"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                      </svg>
                      Chapter
                    </Link>
                    {isPublished && (
                      <Link
                        href={`/book/${book.slug}`}
                        className="cursor-pointer inline-flex items-center justify-center p-2 rounded-lg border border-emerald-100 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 active:scale-[0.97] transition-all"
                        title="View published story"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
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
