"use client";

import { avatarSrc } from "@/lib/avatars";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  ChevronRight,
  Compass,
  Library,
  Pencil,
  PenLine,
  Share2,
  Type,
  Users,
} from "lucide-react";
import AppNav from "@/components/layout/app-nav";
import Footer from "@/components/layout/footer";
import EditProfileModal from "@/components/profile/edit-profile-modal";
import ProfileWritingSection from "@/components/profile/profile-writing-section";
import UserListModal from "@/components/people/user-list-modal";
import ShareSheet from "@/components/share/share-sheet";
import EmptyState, { PageLoader } from "@/components/ui/empty-state";
import { DotPattern, Splash } from "@/components/ui/patterns";
import { booksAPI } from "@/lib/api/books";
import { peopleAPI } from "@/lib/api/people";
import { absoluteUrl } from "@/lib/share";
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
  return new Date(dateStr).toLocaleDateString("en-US", { month: "long", year: "numeric" });
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
  const [editing, setEditing] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [list, setList] = useState<"followers" | "following" | null>(null);

  useEffect(() => {
    setMounted(true);
    if (!tokenManager.hasToken()) {
      router.push("/login");
    } else {
      setCurrentUser(userManager.getUser());
    }
  }, [router]);

  const {
    data: authoredBooks = [],
    isLoading: booksLoading,
    isError: booksError,
    refetch: refetchBooks,
  } = useQuery({
    queryKey: ["authored-books"],
    queryFn: () => booksAPI.getAuthoredBooks(),
    enabled: mounted && tokenManager.hasToken(),
  });

  const { data: social } = useQuery({
    queryKey: ["public-profile", currentUser?.username, currentUser?.id],
    queryFn: () => peopleAPI.getProfile(currentUser!.username),
    enabled: !!currentUser,
  });

  if (!mounted || !currentUser) {
    return (
      <>
        <AppNav />
        <PageLoader fullPage label="Loading profile…" />
      </>
    );
  }

  const profile = currentUser;
  const displayName = profile.display_name || profile.username;
  const totalWords = authoredBooks.reduce((s, b) => s + (b.total_word_count || 0), 0);
  const publishedCount = authoredBooks.filter((b) => b.status === "published").length;

  const stats = [
    {
      icon: BookOpen,
      value: `${authoredBooks.length}`,
      label: "Stories",
      sub: publishedCount > 0 ? `${publishedCount} published` : "None published yet",
      onClick: () => setActiveTab("writing"),
    },
    {
      icon: Type,
      value: formatWords(totalWords),
      label: "Words written",
      sub: totalWords > 0 ? "Across all stories" : "Start writing",
      onClick: () => setActiveTab("writing"),
    },
    {
      icon: Users,
      value: `${social?.follower_count ?? 0}`,
      label: social?.follower_count === 1 ? "Follower" : "Followers",
      sub: social ? `${social.following_count} following` : " ",
      onClick: () => setList("followers"),
    },
  ];

  const quickActions = [
    { href: "/create-story", icon: PenLine, title: "Start a new story", desc: "A blank page full of possibility." },
    { href: "/library", icon: Library, title: "Continue reading", desc: "Pick up where you left off." },
    { href: "/discover", icon: Compass, title: "Discover stories", desc: "Explore what others are creating." },
  ];

  return (
    <>
      <AppNav />
      <main className="min-h-screen bg-zinc-50 pt-[60px] pb-20 page-enter">
        {/* Cover */}
        <div className="relative h-40 overflow-hidden bg-zinc-950 sm:h-52">
          <Splash variant="a" className="-right-16 -top-40 h-[26rem] w-[26rem] text-brand-600" />
          <Splash variant="b" className="-bottom-24 left-[8%] h-56 w-80 text-brand-700/40" />
          <Splash variant="c" className="bottom-6 right-[30%] hidden h-20 w-20 text-brand-600/70 sm:block" />
          <DotPattern className="inset-0 text-white/[0.07] [mask-image:linear-gradient(to_right,black,transparent_70%)]" />
        </div>

        <div className="mx-auto max-w-[960px] px-4 sm:px-6">
          {/* Identity */}
          <div className="relative -mt-14 mb-8 animate-fade-up sm:-mt-16">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
              {avatarSrc(profile.avatar_url) ? (
                <img
                  src={avatarSrc(profile.avatar_url)}
                  alt={displayName}
                  className="h-28 w-28 flex-shrink-0 rounded-3xl object-cover ring-4 ring-white shadow-card sm:h-32 sm:w-32"
                />
              ) : (
                <div className="flex h-28 w-28 flex-shrink-0 select-none items-center justify-center rounded-3xl bg-brand-600 text-4xl font-extrabold tracking-tight text-white ring-4 ring-white shadow-card sm:h-32 sm:w-32">
                  {getInitials(profile.display_name, profile.username)}
                </div>
              )}

              <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:pt-[4.5rem]">
                <div className="min-w-0">
                  <h1 className="truncate text-3xl font-extrabold leading-tight tracking-tight text-zinc-950">{displayName}</h1>
                  <p className="mt-0.5 text-sm font-medium text-zinc-500">@{profile.username}</p>
                  {profile.bio && <p className="mt-2 max-w-lg text-sm leading-relaxed text-zinc-600">{profile.bio}</p>}
                  <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-zinc-500">
                    <CalendarDays className="h-3.5 w-3.5" />
                    Member since {formatJoinDate(profile.created_at)}
                  </p>
                </div>

                <div className="flex flex-shrink-0 gap-2">
                  <button type="button" onClick={() => setEditing(true)} className="btn btn-dark btn-md">
                    <Pencil className="h-4 w-4" />
                    Edit profile
                  </button>
                  <button type="button" onClick={() => setSharing(true)} aria-label="Share profile" title="Share profile" className="btn btn-outline btn-md !px-0 w-10">
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mb-8 grid grid-cols-1 gap-3 animate-fade-up stagger-2 sm:grid-cols-3">
            {stats.map(({ icon: Icon, value, label, sub, onClick }) => {
              return (
                <button key={label} type="button" onClick={onClick} className="card card-interactive flex items-center gap-4 p-5 text-left">
                  <span className="icon-tile flex-shrink-0">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-2xl font-extrabold leading-none tabular-nums text-zinc-950">{value}</span>
                    <span className="mt-1.5 block text-xs font-semibold text-zinc-700">{label}</span>
                    <span className="block text-xs text-zinc-500">{sub}</span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* Tabs */}
          <div className="mb-6 flex gap-1 border-b border-zinc-200 animate-fade-up stagger-3" role="tablist">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={activeTab === t.id}
                onClick={() => setActiveTab(t.id)}
                className={`relative -mb-px px-4 py-3 text-sm font-semibold transition-colors ${
                  activeTab === t.id
                    ? "border-b-2 border-brand-600 text-zinc-950"
                    : "border-b-2 border-transparent text-zinc-500 hover:text-zinc-900"
                }`}
              >
                {t.label}
                {t.id === "writing" && authoredBooks.length > 0 && (
                  <span className="badge badge-neutral ml-2 !px-2 !py-0.5">{authoredBooks.length}</span>
                )}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="min-h-[280px] animate-fade-up stagger-4">
            {activeTab === "overview" && (
              <div className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {quickActions.map(({ href, icon: Icon, title, desc }) => (
                    <Link key={href} href={href} className="card card-interactive group flex flex-col p-5">
                      <span className="icon-tile mb-4">
                        <Icon className="h-5 w-5" />
                      </span>
                      <p className="font-bold text-zinc-950">{title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-zinc-600">{desc}</p>
                      <ArrowRight className="mt-4 h-4 w-4 text-zinc-400 transition-all group-hover:translate-x-1 group-hover:text-brand-600" />
                    </Link>
                  ))}
                </div>

                {authoredBooks.length > 0 ? (
                  <div className="card overflow-hidden">
                    <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4">
                      <div>
                        <h3 className="font-bold text-zinc-950">Recent stories</h3>
                        {publishedCount > 0 && <p className="mt-0.5 text-xs font-semibold text-green-700">{publishedCount} published</p>}
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveTab("writing")}
                        className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-950"
                      >
                        View all
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="divide-y divide-zinc-100">
                      {authoredBooks.slice(0, 4).map((book) => {
                        const isPublished = book.status === "published";
                        return (
                          <Link
                            key={book.id}
                            href={`/write/${book.slug}`}
                            className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-zinc-50"
                          >
                            <div className="h-14 w-10 flex-shrink-0 overflow-hidden rounded-md border border-zinc-200 bg-brand-100">
                              {book.cover_url ? (
                                <img src={book.cover_url} alt="" className="h-full w-full object-cover" />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center">
                                  <span className="text-sm font-black text-brand-700">{book.title[0]}</span>
                                </div>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-semibold text-zinc-950 transition-colors group-hover:text-brand-700">{book.title}</p>
                              <p className="mt-0.5 text-xs text-zinc-500">
                                {book.chapter_count} {book.chapter_count === 1 ? "chapter" : "chapters"}
                                {book.total_word_count > 0 && ` · ${formatWords(book.total_word_count)} words`}
                              </p>
                            </div>
                            <span className={`badge flex-shrink-0 ${isPublished ? "badge-success" : "badge-neutral"}`}>
                              {isPublished ? "Published" : "Draft"}
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="card">
                    <EmptyState
                      icon={PenLine}
                      title="No stories yet"
                      description="Your first story is waiting to be told."
                      action={
                        <Link href="/create-story" className="btn btn-primary btn-md">
                          Start writing
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      }
                    />
                  </div>
                )}
              </div>
            )}

            {activeTab === "writing" && (
              <ProfileWritingSection
                books={authoredBooks}
                isLoading={booksLoading}
                isError={booksError}
                onRetry={() => refetchBooks()}
              />
            )}

            {activeTab === "reading" && (
              <div className="card">
                <EmptyState
                  icon={Library}
                  title="Your reading list"
                  description="Stories you've saved and are currently reading live in your library."
                  action={
                    <Link href="/library" className="btn btn-dark btn-md">
                      Open my library
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  }
                />
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
      {list && <UserListModal username={profile.username} kind={list} onClose={() => setList(null)} />}
      {sharing && (
        <ShareSheet
          open
          onClose={() => setSharing(false)}
          title="Share your profile"
          description="Anyone with the link can see your public profile."
          payload={{
            url: absoluteUrl(`/u/${profile.username}`),
            title: `${displayName} on Caesura`,
            text: `Read ${displayName}'s stories on Caesura`,
          }}
        />
      )}
      {editing && <EditProfileModal user={profile} onClose={() => setEditing(false)} onSaved={setCurrentUser} />}
    </>
  );
}
