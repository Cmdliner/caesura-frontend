"use client";

import Link from "next/link";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Users } from "lucide-react";
import Modal from "@/components/ui/modal";
import EmptyState, { ErrorState } from "@/components/ui/empty-state";
import FollowButton from "@/components/people/follow-button";
import { PersonAvatar } from "@/components/people/person-card";
import { useAuth } from "@/app/providers/auth-provider";
import { peopleAPI } from "@/lib/api/people";

interface UserListModalProps {
  username: string;
  kind: "followers" | "following";
  onClose: () => void;
}

/** Followers / following of one user, in a dialog. Mount it only while it should be open. */
export default function UserListModal({ username, kind, onClose }: UserListModalProps) {
  const { user } = useAuth();

  const { data, isLoading, error, hasNextPage, fetchNextPage, isFetchingNextPage, refetch } = useInfiniteQuery({
    queryKey: ["people-list", username, kind, user?.id ?? "anon"],
    queryFn: ({ pageParam }) =>
      kind === "followers" ? peopleAPI.followers(username, pageParam) : peopleAPI.following(username, pageParam),
    initialPageParam: 1,
    getNextPageParam: (last) => (last.has_more ? last.page + 1 : undefined),
  });

  const people = data?.pages.flatMap((p) => p.items) ?? [];

  return (
    <Modal open onRequestClose={onClose} title={kind === "followers" ? "Followers" : "Following"} description={`@${username}`}>
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="skeleton h-12 w-12 rounded-2xl" />
              <div className="flex-1 space-y-2">
                <div className="skeleton h-3.5 w-1/2 rounded" />
                <div className="skeleton h-3 w-1/3 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <ErrorState title="Couldn't load the list" onRetry={() => refetch()} />
      ) : people.length === 0 ? (
        <EmptyState
          icon={Users}
          title={kind === "followers" ? "No followers yet" : "Not following anyone yet"}
        />
      ) : (
        <ul className="divide-y divide-zinc-100">
          {people.map((p) => (
            <li key={p.id} className="flex items-center gap-3 py-3">
              <Link href={`/u/${p.username}`} onClick={onClose} className="flex min-w-0 flex-1 items-center gap-3">
                <PersonAvatar person={p} className="h-12 w-12 text-base" />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-zinc-950">{p.display_name || p.username}</span>
                  <span className="block truncate text-xs text-zinc-500">@{p.username}</span>
                </span>
              </Link>
              {!p.is_me && <FollowButton username={p.username} isFollowing={p.is_following} />}
            </li>
          ))}
          {hasNextPage && (
            <li className="pt-4 text-center">
              <button type="button" className="btn btn-outline btn-md" onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
                {isFetchingNextPage ? "Loading…" : "Load more"}
              </button>
            </li>
          )}
        </ul>
      )}
    </Modal>
  );
}
