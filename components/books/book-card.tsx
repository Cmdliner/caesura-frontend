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
}: BookCardProps) {
  const formattedViews =
    total_views >= 1000000
      ? `${(total_views / 1000000).toFixed(1)}M`
      : total_views >= 1000
      ? `${(total_views / 1000).toFixed(0)}K`
      : String(total_views);

  // ─── Cover Card (Wattpad-style) ─────────────────────────────────────────────
  // Portrait cover dominates; minimal metadata below; quick-add overlay on hover
  if (variant === "cover" || variant === "compact") {
    return (
      <div className="group flex flex-col gap-2">
        {/* Cover Wrapper */}
        <Link href={`/book/${slug}`} className="block relative rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200" style={{ aspectRatio: "2/3" }}>
          {/* Cover Image */}
          {cover_url ? (
            <img
              src={cover_url}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-orange-100 via-amber-50 to-orange-50 px-3 text-center">
              <svg className="h-8 w-8 text-orange-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span className="text-xs font-semibold text-orange-400 line-clamp-3 leading-tight">{title}</span>
            </div>
          )}

          {/* Hover overlay with add button */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-end justify-center pb-3 opacity-0 group-hover:opacity-100">
            {isAuthenticated ? (
              <button
                onClick={(e) => { e.preventDefault(); onAddToLibrary?.(e); }}
                disabled={isAddingToLibrary}
                className="px-4 py-1.5 rounded-full bg-white text-zinc-900 text-[11px] font-bold shadow-md hover:bg-orange-500 hover:text-white transition-colors disabled:opacity-60"
              >
                {isAddingToLibrary ? "Adding…" : "+ Library"}
              </button>
            ) : (
              <Link
                href="/login"
                onClick={(e) => e.stopPropagation()}
                className="px-4 py-1.5 rounded-full bg-white text-zinc-900 text-[11px] font-bold shadow-md hover:bg-orange-500 hover:text-white transition-colors"
              >
                Sign in
              </Link>
            )}
          </div>
        </Link>

        {/* Metadata */}
        <div className="min-w-0">
          <Link href={`/book/${slug}`}>
            <h3 className="text-[13px] font-semibold text-zinc-900 line-clamp-2 leading-tight hover:text-orange-600 transition-colors">
              {title}
            </h3>
          </Link>
          {author && (
            <p className="text-[11.5px] text-zinc-500 mt-0.5 truncate">{author}</p>
          )}
          <div className="flex items-center gap-1.5 mt-1">
            <svg className="h-3 w-3 text-zinc-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span className="text-[11px] text-zinc-400 font-medium">{formattedViews}</span>
          </div>
        </div>
      </div>
    );
  }

  // ─── Featured Card (for home/trending carousels) ─────────────────────────────
  return (
    <article className="min-w-0 flex-[0_0_78%] sm:flex-[0_0_54%] md:flex-[0_0_39%] lg:flex-[0_0_30%] xl:flex-[0_0_23%]">
      <div className="group relative h-full rounded-xl border border-zinc-200 bg-white overflow-hidden shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_36px_rgba(0,0,0,0.14)]">
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
              className="flex items-center justify-center rounded-full bg-orange-500 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-orange-600"
            >
              Read now
            </Link>

            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); onAddToLibrary?.(e); }}
                disabled={isAddingToLibrary}
                className={`flex-1 flex items-center justify-center rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                  isAddingToLibrary
                    ? "border-zinc-200 bg-zinc-50 text-zinc-400 cursor-not-allowed"
                    : "border-zinc-300 text-zinc-700 hover:border-orange-500 hover:text-orange-500"
                }`}
              >
                {isAddingToLibrary ? "Adding…" : "Save"}
              </button>

              <Drawer.Root>
                <Drawer.Trigger asChild>
                  <button
                    type="button"
                    className="flex-1 flex items-center justify-center rounded-full border border-zinc-300 px-3 py-1.5 text-xs font-semibold text-zinc-700 transition-colors hover:border-zinc-900 hover:text-zinc-900"
                  >
                    Blurb
                  </button>
                </Drawer.Trigger>
                <Drawer.Portal>
                  <Drawer.Overlay className="fixed inset-0 z-60 bg-black/45" />
                  <Drawer.Content className="fixed bottom-0 left-0 right-0 z-70 mx-auto max-w-2xl rounded-t-3xl bg-white p-6 shadow-2xl outline-none">
                    <div className="mx-auto mb-4 h-1.5 w-14 rounded-full bg-zinc-300" />
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-orange-500">{category}</p>
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
                        className="flex-1 flex items-center justify-center rounded-full bg-orange-500 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-black"
                      >
                        Open Story
                      </Link>
                      <Drawer.Close asChild>
                        <button
                          type="button"
                          className="flex-1 flex items-center justify-center rounded-full border border-zinc-300 px-4 py-3 text-sm font-semibold text-zinc-700 transition-colors hover:border-zinc-900 hover:text-zinc-900"
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
    </article>
  );
}
