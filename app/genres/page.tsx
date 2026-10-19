"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useQueries } from "@tanstack/react-query";
import {
  ArrowUpRight, BookOpen, Brain, Building2, Compass, Crown, Drama, Feather, Ghost, Heart, Landmark, Laugh, Library,
  Lightbulb, Moon, Newspaper, Rocket, ScrollText, Search, Shapes, Smile, Sparkles, Swords, UserRound, Zap, type LucideIcon,
} from "lucide-react";
import AppNav from "@/components/layout/app-nav";
import PageHero from "@/components/ui/page-hero";
import EmptyState, { ErrorState } from "@/components/ui/empty-state";
import { Splash } from "@/components/ui/patterns";
import { genresAPI } from "@/lib/api/genres";
import { useGenreQueries } from "@/lib/api/queries";

/** Icon per genre name; anything unknown falls back to a book. */
const ICONS: Record<string, LucideIcon> = {
  fantasy: Sparkles,
  "science fiction": Rocket,
  mystery: Search,
  romance: Heart,
  thriller: Zap,
  horror: Ghost,
  "historical fiction": Landmark,
  "literary fiction": BookOpen,
  adventure: Compass,
  "non-fiction": Newspaper,
  biography: UserRound,
  "self-help": Lightbulb,
  poetry: Feather,
  "children's": Smile,
  fiction: BookOpen,
  "classic literature": Library,
  philosophy: Brain,
  drama: Drama,
  humor: Laugh,
  "short stories": ScrollText,
  gothic: Moon,
  dystopian: Building2,
  mythology: Crown,
};
const iconFor = (name: string): LucideIcon => ICONS[name.toLowerCase()] ?? Swords;

// Featured tile surfaces: dark, brand, light-brand. Text colours follow the surface.
const FEATURED_SURFACES = [
  { bg: "bg-zinc-950", text: "text-white", sub: "text-zinc-400", splash: "text-brand-600/25", pill: "bg-white/10 text-white" },
  { bg: "bg-brand-600", text: "text-white", sub: "text-white/80", splash: "text-brand-500", pill: "bg-white/15 text-white" },
  { bg: "bg-brand-50", text: "text-zinc-950", sub: "text-zinc-600", splash: "text-brand-200", pill: "bg-white text-brand-700" },
] as const;

/** Fan of up to three covers that sits in a featured tile. */
function CoverFan({ covers }: { covers: string[] }) {
  if (covers.length === 0) return null;
  const rot = ["-rotate-[9deg] -translate-x-2", "rotate-0 z-10 -translate-y-2", "rotate-[9deg] translate-x-2"];
  const ordered = covers.length === 3 ? [covers[1], covers[0], covers[2]] : covers;
  return (
    <div className="pointer-events-none absolute -bottom-5 right-3 flex items-end" aria-hidden="true">
      {ordered.map((src, i) => (
        <img
          key={src}
          src={src}
          alt=""
          loading="lazy"
          className={`-ml-9 h-36 w-24 rounded-lg object-cover shadow-[0_10px_24px_rgba(0,0,0,0.35)] ring-2 ring-white/20 transition-transform duration-500 first:ml-0 group-hover:-translate-y-2 lg:-ml-8 lg:h-28 lg:w-[4.5rem] xl:h-32 xl:w-20 ${
            ordered.length === 3 ? rot[i] : ""
          }`}
        />
      ))}
    </div>
  );
}

function GenreTileSkeleton({ tall }: { tall?: boolean }) {
  return <div className={`skeleton rounded-3xl ${tall ? "h-56" : "h-24"}`} />;
}

export default function GenresPage() {
  const { data: genres = [], isLoading, error } = useGenreQueries.useGenres();
  const [filter, setFilter] = useState("");

  const withBooks = useMemo(() => genres.filter((g) => g.book_count > 0).sort((a, b) => b.book_count - a.book_count), [genres]);
  const empty = useMemo(() => genres.filter((g) => g.book_count === 0), [genres]);
  const featured = withBooks.slice(0, 3);
  const totalStories = withBooks.reduce((n, g) => n + g.book_count, 0);

  // Covers for the featured tiles (one small request per tile)
  const coverQueries = useQueries({
    queries: featured.map((g) => ({
      queryKey: ["genre-covers", g.slug],
      queryFn: () => genresAPI.getGenreBooks(g.slug, 1),
      staleTime: 5 * 60 * 1000,
    })),
  });

  const q = filter.trim().toLowerCase();
  const matches = (name: string) => !q || name.toLowerCase().includes(q);
  const gridGenres = withBooks.filter((g) => matches(g.name));
  const showFeatured = !q && featured.length > 0;

  return (
    <>
      <AppNav />
      <main className="min-h-screen bg-zinc-50 pb-20 pt-[60px] page-enter">
        <PageHero
          compact
          title="Genres"
          description={genres.length > 0 ? `${withBooks.length} genres · ${totalStories.toLocaleString()} stories` : undefined}
          containerClassName="mx-auto max-w-6xl px-4 sm:px-6"
          actions={
            genres.length > 0 ? (
              <label className="relative block w-full sm:w-64">
                <span className="sr-only">Filter genres</span>
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <input
                  type="search"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  placeholder="Filter genres"
                  className="field !min-h-10 !rounded-full !pl-10 !text-sm"
                />
              </label>
            ) : undefined
          }
        />

        <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6">
          {isLoading ? (
            <div className="space-y-6">
              <div className="grid gap-5 lg:grid-cols-3">
                {[0, 1, 2].map((i) => <GenreTileSkeleton key={i} tall />)}
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 12 }).map((_, i) => <GenreTileSkeleton key={i} />)}
              </div>
            </div>
          ) : error ? (
            <ErrorState title="Failed to load genres" />
          ) : genres.length === 0 ? (
            <EmptyState icon={Shapes} title="No genres yet" description="Genres will appear here as soon as stories are published." />
          ) : (
            <div className="space-y-12 animate-fade-up">
              {/* Featured */}
              {showFeatured && (
                <section aria-label="Popular genres">
                  <p className="eyebrow mb-4">Popular right now</p>
                  <div className="grid gap-5 lg:grid-cols-3">
                    {featured.map((g, i) => {
                      const surface = FEATURED_SURFACES[i % FEATURED_SURFACES.length];
                      const Icon = iconFor(g.name);
                      const covers = (coverQueries[i]?.data?.items ?? [])
                        .map((b) => b.cover_url)
                        .filter((u): u is string => Boolean(u))
                        .slice(0, 3);
                      return (
                        <Link
                          key={g.id}
                          href={`/genres/${g.slug}`}
                          className={`group relative flex min-h-[15rem] flex-col justify-between overflow-hidden rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-pop sm:min-h-[16rem] ${surface.bg} ${surface.text}`}
                        >
                          <Splash variant="a" className={`-left-16 -top-20 h-52 w-52 ${surface.splash}`} />
                          <span className={`relative flex h-11 w-11 items-center justify-center rounded-2xl ${surface.pill}`}>
                            <Icon className="h-5 w-5" />
                          </span>
                          <CoverFan covers={covers} />
                          <div className="relative max-w-[52%]">
                            <h2 className="font-brand text-3xl font-black leading-tight">{g.name}</h2>
                            <p className={`mt-1 inline-flex items-center gap-1 text-sm font-medium ${surface.sub}`}>
                              {g.book_count.toLocaleString()} {g.book_count === 1 ? "story" : "stories"}
                              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* All genres */}
              <section aria-label="All genres">
                <p className="eyebrow mb-4">{q ? `Results for “${filter.trim()}”` : "All genres"}</p>
                {gridGenres.length === 0 ? (
                  <p className="rounded-2xl border border-dashed border-zinc-300 bg-white p-10 text-center text-sm text-zinc-500">
                    No genre matches &ldquo;{filter.trim()}&rdquo;.
                  </p>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {gridGenres.map((g) => {
                      const Icon = iconFor(g.name);
                      return (
                        <Link key={g.id} href={`/genres/${g.slug}`} className="card card-interactive group flex items-center gap-4 p-4">
                          <span className="icon-tile flex-shrink-0 transition-colors group-hover:!bg-brand-600 group-hover:!text-white">
                            <Icon className="h-5 w-5" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate font-semibold text-zinc-950">{g.name}</span>
                            <span className="block text-xs text-zinc-500 tabular-nums">
                              {g.book_count.toLocaleString()} {g.book_count === 1 ? "story" : "stories"}
                            </span>
                          </span>
                          <ArrowUpRight className="h-4 w-4 flex-shrink-0 text-zinc-300 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-600" />
                        </Link>
                      );
                    })}
                  </div>
                )}
              </section>

              {/* Coming soon */}
              {!q && empty.length > 0 && (
                <section aria-label="Coming soon">
                  <p className="eyebrow mb-4 !text-zinc-500">Coming soon</p>
                  <div className="flex flex-wrap gap-2">
                    {empty.map((g) => (
                      <span key={g.id} className="badge badge-neutral">{g.name}</span>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
