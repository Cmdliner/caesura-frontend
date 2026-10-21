"use client";

import { useEffect, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Search, Users } from "lucide-react";
import AppNav from "@/components/layout/app-nav";
import PageHero from "@/components/ui/page-hero";
import EmptyState, { ErrorState } from "@/components/ui/empty-state";
import PersonCard from "@/components/people/person-card";
import { useAuth } from "@/app/providers/auth-provider";
import { peopleAPI } from "@/lib/api/people";

const filters = [
  { id: "all", label: "Everyone" },
  { id: "writers", label: "Writers" },
] as const;

type FilterId = (typeof filters)[number]["id"];

function SkeletonCard() {
  return (
    <div className="card flex flex-col gap-4 p-5">
      <div className="flex items-start gap-4">
        <div className="skeleton h-14 w-14 rounded-2xl" />
        <div className="flex-1 space-y-2 pt-1">
          <div className="skeleton h-3.5 w-2/3 rounded" />
          <div className="skeleton h-3 w-1/2 rounded" />
        </div>
      </div>
      <div className="skeleton h-3 w-full rounded" />
      <div className="skeleton h-10 w-full rounded-full" />
    </div>
  );
}

export default function PeoplePage() {
  const { user } = useAuth();
  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterId>("all");

  // Wait for a pause in typing so each keystroke doesn't hit the API.
  useEffect(() => {
    const t = setTimeout(() => setQuery(input.trim()), 300);
    return () => clearTimeout(t);
  }, [input]);

  const { data, isLoading, isFetching, isFetchingNextPage, error, hasNextPage, fetchNextPage, refetch } = useInfiniteQuery({
    // The viewer is part of the key because "is_following" differs per user.
    queryKey: ["people", user?.id ?? "anon", query, filter],
    queryFn: ({ pageParam }) =>
      peopleAPI.search({ q: query, filter: filter === "writers" ? "writers" : undefined, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (last) => (last.has_more ? last.page + 1 : undefined),
    staleTime: 30 * 1000,
  });

  const people = data?.pages.flatMap((p) => p.items) ?? [];
  const total = data?.pages[0]?.total;
  const searching = query.length > 0 || filter !== "all";

  return (
    <>
      <AppNav />
      <main className="min-h-screen bg-zinc-50 pb-20 pt-[60px] page-enter">
        <PageHero
          compact
          title="People"
          description={total !== undefined ? `${total.toLocaleString()} ${total === 1 ? "person" : "people"}` : undefined}
          containerClassName="mx-auto max-w-6xl px-4 sm:px-6"
          actions={
            <>
              <div className="flex items-center gap-2">
                {filters.map((f) => (
                  <button key={f.id} type="button" onClick={() => setFilter(f.id)} aria-pressed={filter === f.id} className="chip">
                    {f.label}
                  </button>
                ))}
              </div>
              <label className="relative block w-full sm:w-72">
                <span className="sr-only">Search people</span>
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <input
                  type="search"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Search by name or username"
                  className="field !min-h-10 !rounded-full !pl-10 !text-sm"
                />
              </label>
            </>
          }
        />

        <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6">
          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : error ? (
            <ErrorState title="Couldn't load people" onRetry={() => refetch()} />
          ) : people.length === 0 ? (
            <EmptyState
              icon={Users}
              title={searching ? "No one matches that" : "No one here yet"}
              description={
                searching ? "Try a different name, or switch back to everyone." : "People show up here as they join Caesura."
              }
              action={
                searching ? (
                  <button
                    type="button"
                    className="btn btn-dark btn-md"
                    onClick={() => {
                      setInput("");
                      setFilter("all");
                    }}
                  >
                    Clear search
                  </button>
                ) : undefined
              }
            />
          ) : (
            <>
              <div
                className={`grid gap-4 transition-opacity duration-200 sm:grid-cols-2 lg:grid-cols-3 ${
                  isFetching && !isFetchingNextPage ? "opacity-60" : ""
                }`}
              >
                {people.map((person) => (
                  <PersonCard key={person.id} person={person} />
                ))}
              </div>
              {hasNextPage && (
                <div className="mt-8 flex justify-center">
                  <button type="button" className="btn btn-outline btn-lg" onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
                    {isFetchingNextPage ? "Loading…" : "Load more"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </>
  );
}
