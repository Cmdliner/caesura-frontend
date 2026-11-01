"use client";

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
