"use client";

import Link from "next/link";
import { Drawer } from "vaul";

export interface BookCardProps {
  id: string;
  slug: string;
  title: string;
  author?: string;
  category?: string;
  description?: string;
  cover_url?: string;
  total_views?: number;
  rating?: number;
  variant?: "compact" | "featured" | "cover";
  onAddToLibrary?: (e: React.MouseEvent) => void | Promise<void>;
  isAddingToLibrary?: boolean;
  isAuthenticated?: boolean;
  /** Reading progress 0-100: shows a progress bar on the cover. */
  progress?: number;
  /** Replaces the author line, e.g. "64% · 2d ago" in the library. */
  meta?: string;
  /** What the hover overlay offers. `read` = a Continue/Read pill, `none` = nothing. Default: add to library. */
  overlayAction?: "add" | "read" | "none";
}

export default function BookCard({
  id,
  slug,
  title,
  author = "Unknown Author",
  category = "Fiction",
  description = "An intriguing story waiting to be discovered.",
  cover_url,
  total_views = 0,
  rating,
  variant = "cover",
  onAddToLibrary,
  isAddingToLibrary = false,
  isAuthenticated = false,
  progress,
  meta,
  overlayAction = "add",
}: BookCardProps) {
  const formattedViews =
    total_views >= 1000000
      ? `${(total_views / 1000000).toFixed(1)}M`
      : total_views >= 1000
      ? `${(total_views / 1000).toFixed(0)}K`
      : String(total_views);

  // ─── Cover Card ──────────────────────────────────────────────────────────────
  // Portrait cover on top, title + author/meta + reads below. One look for Discover, Genres, Library.
  if (variant === "cover" || variant === "compact") {
    return (
      <div className="group flex flex-col gap-2.5">
        <Link
          href={`/book/${slug}`}
          className="relative block overflow-hidden rounded-xl bg-zinc-100 shadow-[0_1px_3px_rgba(0,0,0,0.12)] ring-1 ring-black/5 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_14px_30px_rgba(0,0,0,0.18)]"
          style={{ aspectRatio: "2/3" }}
          aria-label={title}
        >
          {cover_url ? (
            <img
              src={cover_url}
              alt=""
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              loading="lazy"
            />
          ) : (
            <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-brand-100 px-4 text-center">
              <span className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-brand-200/70" />
              <span className="absolute -bottom-8 -left-6 h-24 w-24 rounded-full bg-brand-200/70" />
              <span className="relative line-clamp-4 font-brand text-xl font-black leading-tight text-brand-700">{title}</span>
            </div>
          )}

          {typeof progress === "number" && progress > 0 && (
            <span className="absolute inset-x-0 bottom-0 h-1 bg-black/25">
              <span className="block h-full bg-brand-500" style={{ width: `${Math.min(100, progress)}%` }} />
            </span>
          )}

          {overlayAction !== "none" && (
            <span className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/60 via-black/0 to-black/0 pb-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              {overlayAction === "read" ? (
                <span className="btn btn-primary min-h-8 px-4 text-xs shadow-md">{progress ? "Continue" : "Read"}</span>
              ) : isAuthenticated ? (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    onAddToLibrary?.(e);
                  }}
                  disabled={isAddingToLibrary}
                  className="btn min-h-8 bg-white px-4 text-xs text-zinc-900 shadow-md hover:bg-brand-600 hover:text-white"
                >
                  {isAddingToLibrary ? "Adding…" : "+ Library"}
                </button>
              ) : (
                <span
                  className="btn min-h-8 bg-white px-4 text-xs text-zinc-900 shadow-md"
                >
                  Sign in to save
                </span>
              )}
            </span>
          )}
        </Link>

        <div className="min-w-0 px-0.5">
          <Link href={`/book/${slug}`}>
            <h3 className="line-clamp-2 text-[13.5px] font-semibold leading-snug text-zinc-950 transition-colors hover:text-brand-700">{title}</h3>
          </Link>
          <p className="mt-0.5 truncate text-xs text-zinc-500">{meta ?? author}</p>
          {total_views > 0 && !meta && (
            <p className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-zinc-400">
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {formattedViews} reads
            </p>
          )}
        </div>
      </div>
    );
  }

  // ─── Featured Card (for home/trending carousels) ─────────────────────────────
  return (
    <div className="min-w-0">
      <div className="group relative h-full rounded-xl border border-zinc-200 bg-white overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
        {/* Cover */}
        <div className="relative h-52 overflow-hidden bg-zinc-100">
          {cover_url ? (
            <img
              src={cover_url}
              alt={`${title} cover`}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-orange-50">
              <svg className="h-16 w-16 text-orange-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          )}
          <span className="absolute left-3 top-3 rounded-full bg-black/65 px-2.5 py-0.5 text-[11px] font-semibold text-white backdrop-blur-sm">
            {category}
          </span>
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="font-bold text-[15px] text-zinc-950 line-clamp-1 mb-0.5">{title}</h3>
          <p className="text-xs text-zinc-500 mb-3">by {author}</p>

          <div className="flex items-center justify-between text-xs text-zinc-400 mb-4">
            <span className="flex items-center gap-1">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {formattedViews} reads
            </span>
            {rating && (
              <span className="flex items-center gap-0.5">
                <svg className="h-3 w-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {rating.toFixed(1)}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Link
              href={`/book/${slug}`}
              className="btn btn-primary w-full min-h-9 px-3 text-xs"
            >
              Read now
            </Link>

            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); onAddToLibrary?.(e); }}
                disabled={isAddingToLibrary}
                className="btn btn-outline flex-1 min-h-9 px-3 text-xs"
              >
                {isAddingToLibrary ? "Adding…" : "Save"}
              </button>

              <Drawer.Root>
                <Drawer.Trigger asChild>
                  <button
                    type="button"
                    className="btn btn-outline flex-1 min-h-9 px-3 text-xs"
                  >
                    Blurb
                  </button>
                </Drawer.Trigger>
                <Drawer.Portal>
                  <Drawer.Overlay className="fixed inset-0 z-60 bg-black/45" />
                  <Drawer.Content className="fixed bottom-0 left-0 right-0 z-70 mx-auto max-w-2xl rounded-t-3xl bg-white p-6 shadow-2xl outline-none">
                    <div className="mx-auto mb-4 h-1.5 w-14 rounded-full bg-zinc-300" />
                    <p className="eyebrow mb-2">{category}</p>
                    <Drawer.Title asChild>
                      <h4 className="mb-1 text-2xl font-bold text-zinc-950">{title}</h4>
                    </Drawer.Title>
                    <p className="mb-4 text-sm text-zinc-500">by {author}</p>
                    <Drawer.Description asChild>
                      <p className="mb-6 leading-relaxed text-zinc-700">{description}</p>
                    </Drawer.Description>
                    <div className="flex gap-2">
                      <Link
                        href={`/book/${slug}`}
                        className="btn btn-primary btn-lg flex-1"
                      >
                        Open Story
                      </Link>
                      <Drawer.Close asChild>
                        <button
                          type="button"
                          className="btn btn-outline btn-lg flex-1"
                        >
                          Close
                        </button>
                      </Drawer.Close>
                    </div>
                  </Drawer.Content>
                </Drawer.Portal>
              </Drawer.Root>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
