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
      const user = userManager.getUser();
      setCurrentUser(user);
    }
  }, [router]);

  const { data: authoredBooks = [], isLoading: booksLoading } = useQuery({
    queryKey: ["authored-books"],
    queryFn: () => booksAPI.getAuthoredBooks(),
    enabled: mounted && tokenManager.hasToken(),
  });

  const getInitials = (displayName?: string, username?: string) => {
    const name = displayName || username || "?";
    return name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
  };

  if (!mounted || !currentUser) {
    return (
      <>
        <AppNav />
        <main className="min-h-screen bg-white pt-[60px] flex items-center justify-center">
          <div className="text-center">
            <div className="inline-flex h-10 w-10 animate-spin rounded-full border-[3px] border-zinc-200 border-t-orange-500" />
            <p className="mt-4 text-sm text-zinc-500">Loading profile…</p>
          </div>
        </main>
      </>
    );
  }

  const profile = currentUser;
  const profileStats = {
    stories_count: authoredBooks.length,
    total_reads: 0,
    follower_count: 0,
  };

  return (
    <>
      <AppNav />
      <main className="min-h-screen bg-[#f8f8f8] pt-[60px] pb-16 page-enter">
        {/* Cover band */}
        <div className="h-36 sm:h-44 bg-gradient-to-r from-orange-400 via-orange-500 to-amber-400" />

        <div className="mx-auto max-w-[1000px] px-4 sm:px-6">
          {/* Avatar + name row */}
          <div className="flex flex-col sm:flex-row sm:items-end gap-5 -mt-14 sm:-mt-16 mb-6 animate-fade-up">
            {/* Avatar */}
            <div className="flex-shrink-0">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.display_name || profile.username}
                  className="h-28 w-28 sm:h-32 sm:w-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div className="h-28 w-28 sm:h-32 sm:w-32 rounded-full border-4 border-white bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-3xl sm:text-4xl font-bold text-white shadow-lg">
                  {getInitials(profile.display_name, profile.username)}
                </div>
              )}
            </div>

            {/* Name / actions */}
            <div className="flex-1 sm:pb-3 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight leading-tight">
                  {profile.display_name || profile.username}
                </h1>
                <p className="text-[14px] text-orange-500 font-semibold mt-0.5">@{profile.username}</p>
                {profile.bio && (
                  <p className="mt-2 text-[13.5px] text-zinc-600 max-w-md leading-relaxed">{profile.bio}</p>
                )}
              </div>
              <div className="flex gap-2 sm:gap-3 flex-shrink-0 flex-wrap sm:flex-nowrap">
                <button
                  type="button"
                  className="px-4 sm:px-5 py-2 rounded-full bg-zinc-900 text-white text-[12px] sm:text-[13px] font-semibold hover:bg-orange-500 transition-colors"
                >
                  Edit profile
                </button>
                <button
                  type="button"
                  className="px-4 sm:px-5 py-2 rounded-full border border-zinc-200 bg-white text-[12px] sm:text-[13px] font-semibold text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50 transition-colors shadow-sm"
                >
                  Share
                </button>
              </div>
            </div>
          </div>

          {/* Stats bar */}
          <div className="flex items-center divide-x divide-zinc-200 rounded-lg sm:rounded-xl bg-white border border-zinc-200 shadow-sm mb-6 px-1 sm:px-2 gap-1 sm:gap-0 animate-fade-up stagger-2">
            {[
              { value: profileStats.stories_count, label: "Stories" },
              { value: profileStats.total_reads, label: "Reads" },
              { value: profileStats.follower_count, label: "Followers" },
            ].map(({ value, label }) => (
              <div key={label} className="flex-1 text-center py-3 sm:py-4 px-1 sm:px-2">
                <p className="text-xl sm:text-2xl font-bold text-zinc-900 tabular-nums">{value}</p>
                <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wide text-zinc-400 mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* Tabs — Wattpad-style underlines */}
          <div className="flex border-b border-zinc-200 mb-7 bg-white rounded-t-xl -mb-px animate-fade-up stagger-3 overflow-x-auto scrollbar-hide">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={activeTab === t.id}
                onClick={() => setActiveTab(t.id)}
                className={`px-3 sm:px-5 py-3 sm:py-3.5 text-[12px] sm:text-[13.5px] font-semibold transition-colors border-b-[2.5px] whitespace-nowrap flex-shrink-0 ${
                  activeTab === t.id
                    ? "text-zinc-900 border-orange-500"
                    : "text-zinc-500 border-transparent hover:text-zinc-800"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Tab body */}
          <div className="min-h-[240px] animate-fade-up stagger-4">
            {/* ── Overview ── */}
            {activeTab === "overview" && (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Link
                  href="/library"
                  className="group rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm hover:border-orange-200 hover:shadow-md transition-all"
                >
                  <div className="h-8 w-8 rounded-lg bg-orange-50 flex items-center justify-center mb-3">
                    <svg className="h-4 w-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <p className="font-bold text-zinc-900 text-[15px]">Continue reading</p>
                  <p className="mt-1 text-sm text-zinc-500">Pick up where you left off.</p>
                  <span className="mt-3 inline-block text-[13px] font-semibold text-orange-500 group-hover:underline">
                    Open library →
                  </span>
                </Link>

                <Link
                  href="/create-story"
                  className="group rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm hover:border-orange-200 hover:shadow-md transition-all"
                >
                  <div className="h-8 w-8 rounded-lg bg-orange-50 flex items-center justify-center mb-3">
                    <svg className="h-4 w-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </div>
                  <p className="font-bold text-zinc-900 text-[15px]">Start a new draft</p>
                  <p className="mt-1 text-sm text-zinc-500">Blank page, full possibility.</p>
                  <span className="mt-3 inline-block text-[13px] font-semibold text-orange-500 group-hover:underline">
                    Create story →
                  </span>
                </Link>

                <div className="rounded-2xl border border-dashed border-zinc-200 bg-white/60 p-5 sm:col-span-2 lg:col-span-1">
                  <div className="h-8 w-8 rounded-lg bg-zinc-50 flex items-center justify-center mb-3">
                    <svg className="h-4 w-4 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </div>
                  <p className="font-bold text-zinc-400 text-[15px]">Activity</p>
                  <p className="mt-1 text-sm text-zinc-400">Recent likes and comments will appear here.</p>
                </div>
              </div>
            )}

            {/* ── My Writing ── */}
            {activeTab === "writing" && (
              <ProfileWritingSection books={authoredBooks} isLoading={booksLoading} />
            )}

            {/* ── Reading ── */}
            {activeTab === "reading" && (
              <div className="rounded-2xl bg-white border border-zinc-200 shadow-sm p-6">
                <h2 className="text-[16px] font-bold text-zinc-900">Reading list</h2>
                <p className="mt-1 text-sm text-zinc-500">Stories you&apos;ve saved to read later.</p>
                <div className="mt-5">
                  <Link
                    href="/library"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-900 text-white text-sm font-semibold hover:bg-orange-500 transition-colors"
                  >
                    View my library →
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
