"use client";

import { useState } from "react";
import Link from "next/link";
import FollowButton from "@/components/people/follow-button";
import { avatarSrc } from "@/lib/avatars";

export function PersonAvatar({ person, className = "h-14 w-14 text-lg" }: { person: Pick<API.Person, "username" | "display_name" | "avatar_url">; className?: string }) {
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

const plural = (n: number, one: string, many: string) => `${n.toLocaleString()} ${n === 1 ? one : many}`;

export default function PersonCard({ person }: { person: API.Person }) {
  const [followers, setFollowers] = useState(person.follower_count);
  const [seen, setSeen] = useState(person.follower_count);
  if (person.follower_count !== seen) {
    setSeen(person.follower_count);
    setFollowers(person.follower_count);
  }

  const name = person.display_name || person.username;

  return (
    <div className="card flex flex-col gap-4 p-5">
      <div className="flex items-start gap-4">
        <Link href={`/u/${person.username}`} className="flex-shrink-0" aria-label={`${name}'s profile`}>
          <PersonAvatar person={person} />
        </Link>
        <div className="min-w-0 flex-1">
          <Link href={`/u/${person.username}`} className="block truncate font-bold text-zinc-950 hover:text-brand-700">
            {name}
          </Link>
          <p className="truncate text-sm text-zinc-500">@{person.username}</p>
          <p className="mt-1 text-xs text-zinc-500 tabular-nums">
            {plural(followers, "follower", "followers")}
            {person.stories_count > 0 && ` · ${plural(person.stories_count, "story", "stories")}`}
          </p>
        </div>
      </div>

      {person.bio ? (
        <p className="line-clamp-2 text-sm leading-relaxed text-zinc-600">{person.bio}</p>
      ) : (
        <p className="text-sm text-zinc-400">No bio yet.</p>
      )}

      <div className="mt-auto">
        {person.is_me ? (
          <Link href="/profile" className="btn btn-outline btn-md w-full">
            This is you
          </Link>
        ) : (
          <div className="[&>button]:w-full">
            <FollowButton
              username={person.username}
              isFollowing={person.is_following}
              onChange={(r) => setFollowers(r.follower_count)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
