"use client";

import { useState } from "react";
import Link from "next/link";
import FollowButton from "@/components/people/follow-button";
import { Splash } from "@/components/ui/patterns";
import { avatarSrc } from "@/lib/avatars";

export function PersonAvatar({
  person,
  className = "h-14 w-14 text-lg",
}: {
  person: Pick<API.Person, "username" | "display_name" | "avatar_url">;
  className?: string;
}) {
  const name = person.display_name || person.username;
  const src = avatarSrc(person.avatar_url);
  if (src) return <img src={src} alt="" className={`${className} flex-shrink-0 rounded-2xl object-cover`} />;
  return (
    <span
      className={`${className} flex flex-shrink-0 select-none items-center justify-center rounded-2xl bg-brand-600 font-extrabold text-white`}
    >
      {name.slice(0, 1).toUpperCase()}
    </span>
  );
}

// A quiet banner per person: the same flat splash language as the profile cover, in pale tints so it never competes with content.
const BANNERS = [
  { bg: "bg-brand-50", splash: "text-brand-200/80", variant: "a" },
  { bg: "bg-zinc-100", splash: "text-zinc-200", variant: "b" },
  { bg: "bg-brand-100", splash: "text-brand-200", variant: "c" },
] as const;

const bannerFor = (username: string) => {
  const hash = [...username].reduce((n, ch) => n + ch.charCodeAt(0), 0);
  return BANNERS[hash % BANNERS.length];
};

const plural = (n: number, one: string, many: string) => `${n.toLocaleString()} ${n === 1 ? one : many}`;

export default function PersonCard({ person }: { person: API.Person }) {
  const [followers, setFollowers] = useState(person.follower_count);
  const [seen, setSeen] = useState(person.follower_count);
  if (person.follower_count !== seen) {
    setSeen(person.follower_count);
    setFollowers(person.follower_count);
  }

  const name = person.display_name || person.username;
  const banner = bannerFor(person.username);

  return (
    <div className={`card relative flex flex-col gap-4 overflow-hidden p-5 ${banner.bg}`}>
      <Splash variant={banner.variant} className={`-right-12 -top-20 h-64 w-64 ${banner.splash}`} />
      <Splash variant="c" className={`-bottom-10 -left-8 h-28 w-28 ${banner.splash}`} />

      <Link href={`/u/${person.username}`} className="relative block w-fit" aria-label={`${name}'s profile`}>
        <PersonAvatar person={person} className="h-16 w-16 text-xl ring-4 ring-white" />
      </Link>

      <div className="relative min-w-0">
        <Link href={`/u/${person.username}`} className="block truncate font-bold text-zinc-950 hover:text-brand-700">
          {name}
        </Link>
        <p className="truncate text-sm text-zinc-600">@{person.username}</p>
      </div>

      {person.bio ? (
        <p className="relative line-clamp-2 text-sm leading-relaxed text-zinc-700">{person.bio}</p>
      ) : (
        <p className="relative text-sm text-zinc-500">No bio yet.</p>
      )}

      <dl className="relative mt-auto grid grid-cols-2 divide-x divide-zinc-900/10 rounded-xl bg-white/70 py-2.5 text-center">
        <div>
          <dd className="text-sm font-bold tabular-nums text-zinc-950">{followers.toLocaleString()}</dd>
          <dt className="text-xs text-zinc-600">{followers === 1 ? "Follower" : "Followers"}</dt>
        </div>
        <div>
          <dd className="text-sm font-bold tabular-nums text-zinc-950">{person.stories_count.toLocaleString()}</dd>
          <dt className="text-xs text-zinc-600">{person.stories_count === 1 ? "Story" : "Stories"}</dt>
        </div>
      </dl>

      <div className="relative [&>*]:w-full">
        {person.is_me ? (
          <Link href="/profile" className="btn btn-outline btn-md bg-white">
            This is you
          </Link>
        ) : (
          <FollowButton
            username={person.username}
            isFollowing={person.is_following}
            onChange={(r) => setFollowers(r.follower_count)}
          />
        )}
      </div>
    </div>
  );
}
