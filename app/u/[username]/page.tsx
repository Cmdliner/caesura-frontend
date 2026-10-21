"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, CalendarDays, Eye, PenLine, Share2, UserRoundX, Users } from "lucide-react";
import AppNav from "@/components/layout/app-nav";
import Footer from "@/components/layout/footer";
import BookCard from "@/components/books/book-card";
import FollowButton from "@/components/people/follow-button";
import { PersonAvatar } from "@/components/people/person-card";
import UserListModal from "@/components/people/user-list-modal";
import ShareSheet from "@/components/share/share-sheet";
import EmptyState, { ErrorState, PageLoader } from "@/components/ui/empty-state";
import { DotPattern, Splash } from "@/components/ui/patterns";
import { useAuth } from "@/app/providers/auth-provider";
import { peopleAPI } from "@/lib/api/people";
import { absoluteUrl } from "@/lib/share";
import type { APIError } from "@/lib/api/client";

const joined = (iso: string) => new Date(iso).toLocaleDateString("en-US", { month: "long", year: "numeric" });
const compact = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k` : `${n}`);

export default function PublicProfilePage() {
  const { username } = useParams<{ username: string }>();
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [list, setList] = useState<"followers" | "following" | null>(null);
  const [sharing, setSharing] = useState(false);
  const [followerDelta, setFollowerDelta] = useState<number | null>(null);

  const { data: profile, isLoading, error, refetch } = useQuery({
    queryKey: ["public-profile", username, user?.id ?? "anon"],
    queryFn: () => peopleAPI.getProfile(username),
    enabled: !authLoading,
    retry: (count, err) => (err as APIError).status !== 404 && count < 1,
  });

  // Your own page is /profile, which has the editing tools.
  useEffect(() => {
    if (profile?.is_me) router.replace("/profile");
  }, [profile?.is_me, router]);

  const notFound = (error as APIError | null)?.status === 404;

  if (isLoading || authLoading || profile?.is_me) {
    return (
      <>
        <AppNav />
        <PageLoader fullPage label="Loading profile…" />
      </>
    );
  }

  if (notFound) {
    return (
      <>
        <AppNav />
        <main className="pt-[60px]">
          <EmptyState
            fullPage
            icon={UserRoundX}
            title="We couldn't find that person"
            description={`Nobody goes by @${username}. They may have changed their username.`}
            action={
              <Link href="/people" className="btn btn-dark btn-md">
                Find people
              </Link>
            }
          />
        </main>
      </>
    );
  }

  if (error || !profile) {
    return (
      <>
        <AppNav />
        <main className="pt-[60px]">
          <ErrorState fullPage title="Couldn't load this profile" onRetry={() => refetch()} backHref="/people" backLabel="Find people" />
        </main>
      </>
    );
  }

  const name = profile.display_name || profile.username;
  const followers = followerDelta ?? profile.follower_count;

  const stats = [
    { icon: Users, value: compact(followers), label: followers === 1 ? "Follower" : "Followers", onClick: () => setList("followers") },
    { icon: Users, value: compact(profile.following_count), label: "Following", onClick: () => setList("following") },
    { icon: BookOpen, value: `${profile.stories_count}`, label: profile.stories_count === 1 ? "Story" : "Stories" },
    { icon: Eye, value: compact(profile.total_reads), label: "Reads" },
  ];

  return (
    <>
      <AppNav />
      <main className="min-h-screen bg-zinc-50 pt-[60px] pb-20 page-enter">
        <div className="relative h-36 overflow-hidden bg-zinc-950 sm:h-48">
          <Splash variant="a" className="-right-16 -top-40 h-[26rem] w-[26rem] text-brand-600" />
          <Splash variant="b" className="-bottom-24 left-[8%] h-56 w-80 text-brand-700/40" />
          <DotPattern className="inset-0 text-white/[0.07] [mask-image:linear-gradient(to_right,black,transparent_70%)]" />
        </div>

        <div className="mx-auto max-w-[960px] px-4 sm:px-6">
          <div className="relative -mt-14 mb-8 animate-fade-up sm:-mt-16">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
              <PersonAvatar person={profile} className="h-28 w-28 !rounded-3xl text-4xl ring-4 ring-white shadow-card sm:h-32 sm:w-32" />

              <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:pt-[4.5rem]">
                <div className="min-w-0">
                  <h1 className="truncate text-3xl font-extrabold leading-tight tracking-tight text-zinc-950">{name}</h1>
                  <p className="mt-0.5 text-sm font-medium text-zinc-500">@{profile.username}</p>
                  {profile.bio && <p className="mt-2 max-w-lg whitespace-pre-line text-sm leading-relaxed text-zinc-600">{profile.bio}</p>}
                  <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-zinc-500">
                    <CalendarDays className="h-3.5 w-3.5" />
                    Member since {joined(profile.created_at)}
                  </p>
                </div>

                <div className="flex flex-shrink-0 gap-2">
                  <FollowButton
                    username={profile.username}
                    isFollowing={profile.is_following}
                    onChange={(r) => setFollowerDelta(r.follower_count)}
                    size="md"
                  />
                  <button
                    type="button"
                    onClick={() => setSharing(true)}
                    aria-label="Share profile"
                    title="Share profile"
                    className="btn btn-outline btn-md !px-0 w-10"
                  >
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8 grid grid-cols-2 gap-3 animate-fade-up stagger-2 sm:grid-cols-4">
            {stats.map(({ icon: Icon, value, label, onClick }) => {
              const Tag = onClick ? "button" : "div";
              return (
                <Tag
                  key={label}
                  {...(onClick ? { type: "button" as const, onClick } : {})}
                  className={`card flex items-center gap-3 p-4 text-left ${onClick ? "card-interactive" : ""}`}
                >
                  <span className="icon-tile flex-shrink-0">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-xl font-extrabold leading-none tabular-nums text-zinc-950">{value}</span>
                    <span className="mt-1 block text-xs font-medium text-zinc-600">{label}</span>
                  </span>
                </Tag>
              );
            })}
          </div>

          <section className="animate-fade-up stagger-3" aria-label="Stories">
            <h2 className="mb-5 text-[13px] font-bold uppercase tracking-widest text-zinc-500">Stories</h2>
            {profile.stories.length === 0 ? (
              <div className="card">
                <EmptyState icon={PenLine} title="No published stories yet" description={`${name} hasn't published anything so far.`} />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 md:grid-cols-4">
                {profile.stories.map((b) => (
                  <BookCard
                    key={b.id}
                    id={b.id}
                    slug={b.slug}
                    title={b.title}
                    description={b.description}
                    cover_url={b.cover_url}
                    total_views={b.total_views}
                    author={name}
                    variant="cover"
                    overlayAction="none"
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />

      {list && <UserListModal username={profile.username} kind={list} onClose={() => setList(null)} />}
      {sharing && (
        <ShareSheet
          open
          onClose={() => setSharing(false)}
          title="Share profile"
          description={name}
          payload={{
            url: absoluteUrl(`/u/${profile.username}`),
            title: `${name} on Caesura`,
            text: `Read ${name}'s stories on Caesura`,
          }}
        />
      )}
    </>
  );
}
