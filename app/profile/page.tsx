"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import AppNav from "@/components/layout/app-nav";
import Footer from "@/components/layout/footer";
import ProfileWritingSection from "@/components/profile/profile-writing-section";
import { booksAPI } from "@/lib/api/books";
import { tokenManager, userManager } from "@/lib/utils";

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "writing", label: "My Writing" },
  { id: "reading", label: "Reading" },
] as const;

type TabId = (typeof tabs)[number]["id"];

function getInitials(displayName?: string, username?: string) {
  const name = displayName || username || "?";
  return name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
}

function formatJoinDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

function formatWords(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return `${n}`;
}

export default function ProfilePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [currentUser, setCurrentUser] = useState<API.User | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  useEffect(() => {
    setMounted(true);
    if (!tokenManager.hasToken()) {
      router.push("/login");
    } else {
      setCurrentUser(userManager.getUser());
    }
  }, [router]);

  const { data: authoredBooks = [], isLoading: booksLoading } = useQuery({
    queryKey: ["authored-books"],
    queryFn: () => booksAPI.getAuthoredBooks(),
    enabled: mounted && tokenManager.hasToken(),
  });

  if (!mounted || !currentUser) {
    return (
      <>
        <AppNav />
        <main className="min-h-screen bg-zinc-50 pt-[60px] flex items-center justify-center">
          <div className="text-center">
            <div className="inline-flex h-10 w-10 animate-spin rounded-full border-[3px] border-zinc-200 border-t-zinc-700" />
            <p className="mt-4 text-sm text-zinc-400">Loading profile…</p>
          </div>
        </main>
      </>
    );
  }

  const profile = currentUser;
  const totalWords = authoredBooks.reduce((s, b) => s + (b.total_word_count || 0), 0);
  const publishedCount = authoredBooks.filter((b) => b.status === "published").length;

  return (
    <>
      <AppNav />
      <main className="min-h-screen bg-zinc-50 pt-[60px] pb-20 page-enter">

        {/* ── Cover band ─────────────────────────────────────────────────── */}
        <div className="relative h-36 sm:h-48 overflow-hidden bg-zinc-950">
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg,transparent,transparent 23px,rgba(255,255,255,1) 23px,rgba(255,255,255,1) 24px),repeating-linear-gradient(90deg,transparent,transparent 23px,rgba(255,255,255,1) 23px,rgba(255,255,255,1) 24px)",
            }}
          />
          {/* Member since — bottom-left of cover */}
          <div className="absolute bottom-3 right-4 sm:right-6 flex items-center gap-1.5">
            <svg className="h-3 w-3 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-[11px] text-white/30 font-medium">
              Member since {formatJoinDate(profile.created_at)}
            </span>
          </div>
        </div>

        <div className="mx-auto max-w-[960px] px-4 sm:px-6">

          {/* ── Avatar + identity ─────────────────────────────────────────── */}
          <div className="relative -mt-14 sm:-mt-16 mb-6 animate-fade-up">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">

              {/* Avatar */}
              <div className="relative flex-shrink-0 group">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.display_name || profile.username}
                    className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl object-cover ring-4 ring-white shadow-xl"
                  />
                ) : (
                  <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl ring-4 ring-white shadow-xl bg-zinc-800 flex items-center justify-center text-3xl font-extrabold text-white/90 tracking-tight select-none">
                    {getInitials(profile.display_name, profile.username)}
                  </div>
                )}
              </div>

              {/* Name + bio + actions */}
              <div className="flex-1 sm:pb-1 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
                <div>
                  <h1 className="text-2xl sm:text-[28px] font-extrabold text-zinc-900 leading-tight tracking-tight">
                    {profile.display_name || profile.username}
                  </h1>
                  <p className="text-[13px] text-zinc-400 font-medium mt-0.5">
                    @{profile.username}
                  </p>
                  {profile.bio && (
                    <p className="mt-1.5 text-[13px] text-zinc-500 max-w-sm leading-relaxed">
                      {profile.bio}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    type="button"
                    className="cursor-pointer px-4 py-2 rounded-xl bg-zinc-900 text-white text-[12.5px] font-semibold hover:bg-zinc-700 active:scale-[0.97] transition-all shadow-sm"
                  >
                    Edit profile
                  </button>
                  <button
                    type="button"
                    className="cursor-pointer px-3 py-2 rounded-xl border border-zinc-200 bg-white text-zinc-500 hover:text-zinc-800 hover:border-zinc-300 active:scale-[0.97] transition-all shadow-sm"
                    title="Share profile"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ── Stats bar ─────────────────────────────────────────────────── */}
          <div className="mb-6 rounded-2xl bg-white border border-zinc-200 shadow-sm overflow-hidden animate-fade-up stagger-2">
            <div className="grid grid-cols-3 divide-x divide-zinc-100">
              {[
                {
                  value: authoredBooks.length,
                  label: "Stories",
                  sub: publishedCount > 0 ? `${publishedCount} published` : undefined,
                  onClick: () => setActiveTab("writing"),
                  color: "text-zinc-900",
                },
                {
                  value: formatWords(totalWords),
                  label: "Words written",
                  sub: totalWords > 0 ? "across all stories" : "Start writing!",
                  onClick: () => setActiveTab("writing"),
                  color: "text-zinc-900",
                },
                {
                  value: 0,
                  label: "Followers",
                  sub: "Coming soon",
                  onClick: undefined,
                  color: "text-zinc-400",
                },
              ].map(({ value, label, sub, onClick, color }) => (
                <button
                  key={label}
                  type="button"
                  onClick={onClick}
                  className={`flex flex-col items-center gap-0.5 py-4 px-2 transition-colors group ${
                    onClick ? "cursor-pointer hover:bg-zinc-50 active:bg-zinc-100" : "cursor-default"
                  }`}
                >
                  <p className={`text-[22px] font-extrabold tabular-nums leading-none ${color} ${onClick ? "group-hover:text-zinc-600 transition-colors" : ""}`}>
                    {value}
                  </p>
                  <p className="text-[10.5px] font-semibold uppercase tracking-widest text-zinc-400 mt-0.5 text-center">
                    {label}
                  </p>
                  {sub && (
                    <p className="text-[10px] text-zinc-300 mt-0.5 text-center">{sub}</p>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* ── Tabs ──────────────────────────────────────────────────────── */}
          <div className="mb-6 animate-fade-up stagger-3">
            <div className="flex gap-0.5 bg-zinc-100 p-1 rounded-xl w-fit" role="tablist">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`cursor-pointer relative px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg text-[12.5px] sm:text-[13px] font-semibold transition-all whitespace-nowrap active:scale-[0.97] ${
                    activeTab === t.id
                      ? "bg-white text-zinc-900 shadow-sm"
                      : "text-zinc-500 hover:text-zinc-700 hover:bg-zinc-50"
                  }`}
                >
                  {t.label}
                  {t.id === "writing" && authoredBooks.length > 0 && (
                    <span className={`ml-1.5 text-[10.5px] font-bold px-1 py-0.5 rounded-full ${
                      activeTab === t.id
                        ? "bg-zinc-100 text-zinc-600"
                        : "text-zinc-400"
                    }`}>
                      {authoredBooks.length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* ── Tab content ───────────────────────────────────────────────── */}
          <div className="min-h-[280px] animate-fade-up stagger-4">

            {/* Overview */}
            {activeTab === "overview" && (
              <div className="space-y-4">

                {/* Quick action cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    {
                      href: "/create-story",
                      icon: "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z",
                      title: "Start a new story",
                      desc: "A blank page full of possibility.",
                      cta: "Create story",
                      span: "",
                    },
                    {
                      href: "/library",
                      icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
                      title: "Continue reading",
                      desc: "Pick up where you left off.",
                      cta: "Open library",
                      span: "",
                    },
                    {
                      href: "/discover",
                      icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
                      title: "Discover stories",
                      desc: "Explore what others are creating.",
                      cta: "Browse",
                      span: "sm:col-span-2 lg:col-span-1",
                    },
                  ].map(({ href, icon, title, desc, cta, span }) => (
                    <Link
                      key={href}
                      href={href}
                      className={`group relative rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-zinc-300 active:scale-[0.99] transition-all overflow-hidden ${span}`}
                    >
                      <div className="h-9 w-9 rounded-xl bg-zinc-100 flex items-center justify-center mb-3 group-hover:bg-zinc-900 transition-colors">
                        <svg className="h-[18px] w-[18px] text-zinc-500 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                        </svg>
                      </div>
                      <p className="font-bold text-zinc-900 text-[14.5px]">{title}</p>
                      <p className="mt-1 text-[12.5px] text-zinc-500 leading-relaxed">{desc}</p>
                      <span className="mt-3 inline-flex items-center gap-1 text-[12.5px] font-semibold text-zinc-700 group-hover:gap-2 transition-all">
                        {cta}
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </Link>
                  ))}
                </div>

                {/* Recent stories mini-list */}
                {authoredBooks.length > 0 ? (
                  <div className="rounded-2xl bg-white border border-zinc-200 shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100">
                      <div>
                        <h3 className="text-[13.5px] font-bold text-zinc-900">Recent stories</h3>
                        {publishedCount > 0 && (
                          <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">
                            {publishedCount} published
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveTab("writing")}
                        className="cursor-pointer text-[12px] font-semibold text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 px-2.5 py-1 rounded-lg transition-colors active:scale-95"
                      >
                        View all →
                      </button>
                    </div>
                    <div className="divide-y divide-zinc-50">
                      {authoredBooks.slice(0, 4).map((book) => {
                        const isPublished = book.status === "published";
                        return (
                          <Link
                            key={book.id}
                            href={`/write/${book.slug}`}
                            className="flex items-center gap-3 px-5 py-3.5 hover:bg-zinc-50 active:bg-zinc-100 transition-colors group"
                          >
                            {/* Mini cover */}
                            <div className="h-10 w-7 rounded-md flex-shrink-0 overflow-hidden bg-zinc-100 border border-zinc-200">
                              {book.cover_url ? (
                                <img src={book.cover_url} alt="" className="h-full w-full object-cover" />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center">
                                  <span className="text-[9px] font-black text-zinc-300">{book.title[0]}</span>
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[13px] font-semibold text-zinc-900 truncate group-hover:text-zinc-600 transition-colors">
                                {book.title}
                              </p>
                              <p className="text-[11px] text-zinc-400">
                                {book.chapter_count} {book.chapter_count === 1 ? "chapter" : "chapters"}
                                {book.total_word_count > 0 && ` · ${formatWords(book.total_word_count)} words`}
                              </p>
                            </div>
                            <span className={`text-[10.5px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${
                              isPublished
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                : "bg-zinc-100 text-zinc-500 border border-zinc-200"
                            }`}>
                              {isPublished ? "Published" : "Draft"}
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl border-2 border-dashed border-zinc-200 bg-white p-10 text-center">
                    <div className="mx-auto mb-4 h-12 w-12 rounded-xl bg-zinc-100 flex items-center justify-center">
                      <svg className="h-6 w-6 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                    </div>
                    <p className="text-[14px] font-bold text-zinc-700">No stories yet</p>
                    <p className="mt-1 text-sm text-zinc-400">Your first story is waiting to be told.</p>
                    <Link
                      href="/create-story"
                      className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 text-white text-sm font-semibold hover:bg-zinc-700 active:scale-95 transition-all shadow-sm"
                    >
                      Start writing →
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* My Writing */}
            {activeTab === "writing" && (
              <ProfileWritingSection books={authoredBooks} isLoading={booksLoading} />
            )}

            {/* Reading */}
            {activeTab === "reading" && (
              <div className="rounded-2xl bg-white border border-zinc-200 shadow-sm p-10 text-center">
                <div className="mx-auto mb-4 h-14 w-14 rounded-2xl bg-zinc-100 flex items-center justify-center">
                  <svg className="h-7 w-7 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <h3 className="text-[15px] font-bold text-zinc-800">Your reading list</h3>
                <p className="mt-1.5 text-sm text-zinc-500 max-w-xs mx-auto leading-relaxed">
                  Stories you&apos;ve saved and are currently reading live in your library.
                </p>
                <Link
                  href="/library"
                  className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 text-white text-sm font-semibold hover:bg-zinc-700 active:scale-95 transition-all shadow-sm"
                >
                  Open my library →
                </Link>
              </div>
            )}

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
