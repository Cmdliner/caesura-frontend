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
  variant?: "compact" | "featured";
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
  variant = "featured",
  onAddToLibrary,
  isAddingToLibrary = false,
  isAuthenticated = false,
}: BookCardProps) {
  const formattedViews = total_views >= 1000000
    ? `${(total_views / 1000000).toFixed(1)}M`
    : total_views >= 1000
      ? `${(total_views / 1000).toFixed(0)}K`
      : total_views;

  // Compact variant for discover page
  if (variant === "compact") {
    return (
      <Link href={`/book/${slug}`}>
        <div className="group h-full flex flex-col rounded-lg overflow-hidden bg-white border border-zinc-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
          {/* Book Cover */}
          <div className="relative w-full bg-zinc-100 overflow-hidden" style={{ aspectRatio: "9/12" }}>
            {cover_url ? (
              <img
                src={cover_url}
                alt={title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-orange-50">
                <svg className="h-10 w-10 text-orange-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 6.253v13m0-13C6.5 6.253 2 10.998 2 17s4.5 10.747 10 10.747c5.5 0 10-4.999 10-11.747S17.5 6.253 12 6.253z"
                  />
                </svg>
              </div>
            )}
          </div>

          {/* Book Info */}
          <div className="flex flex-col flex-1 p-3">
            <h3 className="font-semibold text-xs text-zinc-900 line-clamp-2 mb-1 leading-tight">
              {title}
            </h3>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Footer */}
            <div className="space-y-2">
              {/* Stats */}
              <div className="flex items-center gap-1 text-[10px] text-zinc-500">
                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span>{formattedViews}</span>
              </div>

              {/* Add Button */}
              {isAuthenticated ? (
                <button
                  onClick={onAddToLibrary}
                  disabled={isAddingToLibrary}
                  className={`w-full py-1.5 rounded text-[10px] font-semibold transition-all duration-200 ${
                    isAddingToLibrary
                      ? "bg-zinc-100 text-zinc-500 cursor-not-allowed"
                      : "bg-orange-500 text-white hover:bg-orange-600 active:scale-95"
                  }`}
                >
                  {isAddingToLibrary ? "Adding..." : "+ Add"}
                </button>
              ) : (
                <Link
                  href="/login"
                  className="block w-full py-1.5 rounded bg-zinc-100 text-[10px] font-semibold text-zinc-700 text-center hover:bg-zinc-200 transition-colors"
                >
                  Sign in
                </Link>
              )}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Featured variant for trending/home page
  return (
    <article className="min-w-0 flex-[0_0_78%] sm:flex-[0_0_54%] md:flex-[0_0_39%] lg:flex-[0_0_30%] xl:flex-[0_0_23%]">
      <div className="group relative h-full rounded-r-2xl rounded-l-md border border-zinc-200 bg-white p-3 shadow-[0_6px_24px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_36px_rgba(0,0,0,0.14)]">
        <span className="absolute left-0 top-0 h-full w-2 rounded-l-md bg-linear-to-b from-orange-400 to-orange-600" />

        <div className="relative h-52 overflow-hidden rounded-r-xl rounded-l-sm">
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M12 6.253v13m0-13C6.5 6.253 2 10.998 2 17s4.5 10.747 10 10.747c5.5 0 10-4.999 10-11.747S17.5 6.253 12 6.253z"
                />
              </svg>
            </div>
          )}
          <span className="absolute left-3 top-3 rounded-full bg-black/75 px-3 py-1 text-xs font-semibold text-white">
            {category}
          </span>
        </div>

        <div className="px-2 pb-2 pt-4">
          <h3 className="mb-1 text-lg font-semibold text-zinc-950">{title}</h3>
          <p className="mb-3 text-sm text-zinc-600">by {author}</p>

          <div className="mb-4 flex items-center justify-between text-xs text-zinc-500">
            <span>{formattedViews} reads</span>
            {rating && <span>★ {rating.toFixed(1)}</span>}
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href={`/book/${slug}`}
              className="inline-flex flex-1 items-center justify-center rounded-full bg-orange-500 px-3 py-2 text-xs font-semibold text-white transition-colors duration-300 hover:bg-black"
            >
              Binge Read
            </Link>

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onAddToLibrary?.(e);
              }}
              disabled={isAddingToLibrary}
              className={`inline-flex flex-1 items-center justify-center rounded-full border px-3 py-2 text-xs font-semibold transition-colors duration-300 ${
                isAddingToLibrary
                  ? "border-zinc-200 bg-zinc-50 text-zinc-400 cursor-not-allowed"
                  : "border-zinc-300 text-zinc-700 hover:border-orange-500 hover:text-orange-500"
              }`}
            >
              {isAddingToLibrary ? "Adding..." : "Save for later"}
            </button>

            <Drawer.Root>
              <Drawer.Trigger asChild>
                <button
                  type="button"
                  className="inline-flex w-full items-center justify-center rounded-full border border-zinc-300 px-3 py-2 text-xs font-semibold text-zinc-700 transition-colors duration-300 hover:border-orange-500 hover:text-orange-500"
                >
                  Peek Blurb
                </button>
              </Drawer.Trigger>
              <Drawer.Portal>
                <Drawer.Overlay className="fixed inset-0 z-60 bg-black/45" />
                <Drawer.Content className="fixed bottom-0 left-0 right-0 z-70 mx-auto max-w-2xl rounded-t-3xl bg-white p-6 shadow-2xl outline-none">
                  <div className="mx-auto mb-4 h-1.5 w-14 rounded-full bg-zinc-300" />
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-orange-500">
                    {category}
                  </p>
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
                      className="inline-flex flex-1 items-center justify-center rounded-full bg-orange-500 px-4 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:bg-black"
                    >
                      Open Story
                    </Link>
                    <Drawer.Close asChild>
                      <button
                        type="button"
                        className="inline-flex flex-1 items-center justify-center rounded-full border border-zinc-300 px-4 py-3 text-sm font-semibold text-zinc-700 transition-colors duration-300 hover:border-zinc-900 hover:text-zinc-900"
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
    </article>
  );
}
