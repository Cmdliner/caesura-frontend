"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Drawer } from "vaul";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

type Book = {
  id: string;
  title: string;
  author: string;
  category: string;
  cover: string;
  blurb: string;
  progress: number;
  lastRead: string;
  shelf: "reading" | "saved" | "finished";
};

const books: Book[] = [
  {
    id: "1",
    title: "The Midnight Shelf",
    author: "Sarah Chen",
    category: "Fantasy",
    cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80",
    blurb: "A strange archive opens only at midnight, where every shelf reveals a life she could have lived.",
    progress: 62,
    lastRead: "2 days ago",
    shelf: "reading",
  },
  {
    id: "2",
    title: "Salt & Starlight",
    author: "Jordan Lee",
    category: "Literary",
    cover: "https://images.unsplash.com/photo-1544947950-fa07a98d2378?auto=format&fit=crop&w=400&q=80",
    blurb: "Two siblings map constellations from a lighthouse that should not exist.",
    progress: 14,
    lastRead: "Yesterday",
    shelf: "reading",
  },
  {
    id: "3",
    title: "Paper Boats",
    author: "Maya Okonkwo",
    category: "Romance",
    cover: "https://images.unsplash.com/photo-1516979187457-6379924a443f?auto=format&fit=crop&w=400&q=80",
    blurb: "Letters in bottles, replies in dreams.",
    progress: 0,
    lastRead: "—",
    shelf: "saved",
  },
  {
    id: "4",
    title: "Winter in the Stacks",
    author: "Alex Rivera",
    category: "Mystery",
    cover: "https://images.unsplash.com/photo-1524578271613-d550eacf6090?auto=format&fit=crop&w=400&q=80",
    blurb: "Every book returned late comes back with a new ending.",
    progress: 100,
    lastRead: "Last week",
    shelf: "finished",
  },
];

const filters = [
  { id: "all", label: "All" },
  { id: "reading", label: "Reading" },
  { id: "saved", label: "Saved" },
  { id: "finished", label: "Finished" },
] as const;

type FilterId = (typeof filters)[number]["id"];

export default function LibraryPage() {
  const [filter, setFilter] = useState<FilterId>("all");
  const [activeBook, setActiveBook] = useState<Book | null>(null);
  const [layout, setLayout] = useState<"list" | "grid">("list");

  const filtered = useMemo(() => {
    if (filter === "all") return books;
    return books.filter((b) => b.shelf === filter);
  }, [filter]);

  return (
    <>
      <Header />
      <main className="relative min-h-screen overflow-x-hidden bg-[#f6f8fc] pb-16 pt-[4.5rem] sm:pt-24">
        <div
          className="pointer-events-none absolute inset-0 z-0 opacity-[0.5] bg-[linear-gradient(rgba(30,41,59,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(30,41,59,0.035)_1px,transparent_1px)] [background-size:32px_32px] sm:[background-size:44px_44px]"
          aria-hidden="true"
        />

        <div className="relative z-10 mx-auto max-w-2xl px-4 sm:px-6 lg:max-w-3xl">
          <nav className="mb-6 text-xs text-zinc-500 sm:text-sm" aria-label="Breadcrumb">
            <Link href="/" className="transition-colors hover:text-orange-600">
              Home
            </Link>
            <span className="mx-2 text-zinc-400" aria-hidden="true">
              /
            </span>
            <span className="font-medium text-zinc-700">Library</span>
          </nav>

          <header className="mb-8">
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-orange-500">Your shelf</p>
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl">Library</h1>
            <p className="mt-2 max-w-lg text-sm leading-relaxed text-zinc-600">
              Stories you&apos;re reading, saving, and have finished—pick up where you left off.
            </p>
          </header>


          <div className="mb-6 flex flex-wrap items-center gap-2 justify-between">
            <div className="flex gap-2" role="group" aria-label="Filter by shelf">
              {filters.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFilter(f.id)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    filter === f.id
                      ? "bg-zinc-900 text-white"
                      : "border border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <div className="flex gap-1 ml-auto">
              <button
                type="button"
                aria-label="List view"
                onClick={() => setLayout("list")}
                className={`rounded-full p-2 border transition-colors ${layout === "list" ? "bg-zinc-900 text-white border-zinc-900" : "bg-white text-zinc-700 border-zinc-200 hover:border-zinc-300"}`}
              >
                {/* List icon */}
                <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><rect x="4" y="5" width="12" height="2" rx="1" fill="currentColor"/><rect x="4" y="9" width="12" height="2" rx="1" fill="currentColor"/><rect x="4" y="13" width="12" height="2" rx="1" fill="currentColor"/></svg>
              </button>
              <button
                type="button"
                aria-label="Grid view"
                onClick={() => setLayout("grid")}
                className={`rounded-full p-2 border transition-colors ${layout === "grid" ? "bg-zinc-900 text-white border-zinc-900" : "bg-white text-zinc-700 border-zinc-200 hover:border-zinc-300"}`}
              >
                {/* Grid icon */}
                <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><rect x="4" y="4" width="5" height="5" rx="1" fill="currentColor"/><rect x="11" y="4" width="5" height="5" rx="1" fill="currentColor"/><rect x="4" y="11" width="5" height="5" rx="1" fill="currentColor"/><rect x="11" y="11" width="5" height="5" rx="1" fill="currentColor"/></svg>
              </button>
            </div>
          </div>

          {filtered.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-zinc-200 bg-white/80 px-6 py-12 text-center text-sm text-zinc-500">
              Nothing here yet.{" "}
              <Link href="/discover" className="font-semibold text-orange-600 hover:underline">
                Discover stories
              </Link>
            </p>
          ) : layout === "list" ? (
            <ul className="flex flex-col gap-3">
              {filtered.map((book) => (
                <li key={book.id}>
                  <button
                    type="button"
                    onClick={() => setActiveBook(book)}
                    className="group flex w-full gap-4 rounded-2xl border border-zinc-200 bg-white p-4 text-left shadow-sm transition-all hover:border-orange-200/80 hover:shadow-md"
                  >
                    <div className="relative h-[4.5rem] w-14 shrink-0 overflow-hidden rounded-lg bg-zinc-100 sm:h-24 sm:w-[4.5rem]">
                      <img
                        src={book.cover}
                        alt=""
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    <div className="min-w-0 flex-1 py-0.5">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h2 className="truncate font-semibold text-zinc-900">{book.title}</h2>
                          <p className="mt-0.5 text-sm text-zinc-500">{book.author}</p>
                        </div>
                        <span className="shrink-0 rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-zinc-600 sm:text-xs">
                          {book.shelf}
                        </span>
                      </div>
                      <div className="mt-3">
                        <div className="mb-1 flex justify-between text-[11px] text-zinc-500 sm:text-xs">
                          <span>Progress</span>
                          <span>{book.progress}%</span>
                        </div>
                        <div className="h-1 overflow-hidden rounded-full bg-zinc-100">
                          <div
                            className="h-full rounded-full bg-orange-500 transition-[width] duration-500"
                            style={{ width: `${book.progress}%` }}
                          />
                        </div>
                      </div>
                      <p className="mt-2 text-[11px] text-zinc-400 sm:text-xs">Last read {book.lastRead}</p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {filtered.map((book) => (
                <li key={book.id}>
                  <button
                    type="button"
                    onClick={() => setActiveBook(book)}
                    className="group flex flex-col w-full h-full rounded-xl border border-zinc-200 bg-white px-3 pt-3 pb-4 text-left shadow-sm transition-all hover:border-orange-200/80 hover:shadow-md"
                    style={{ aspectRatio: '3/4', minHeight: 0 }}
                  >
                    <div className="relative mb-3 flex items-center justify-center" style={{ height: '180px' }}>
                      <div className="absolute inset-0 rounded-lg bg-zinc-100" />
                      <img
                        src={book.cover}
                        alt=""
                        className="relative z-10 h-full w-auto max-w-full max-h-full object-cover rounded-md shadow group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                    <div className="min-w-0 flex-1 flex flex-col gap-1">
                      <h2 className="truncate font-semibold text-zinc-900 text-base leading-tight">{book.title}</h2>
                      <p className="text-xs text-zinc-500 leading-tight">{book.author}</p>
                      <div className="h-1.5 mt-1 overflow-hidden rounded-full bg-zinc-100">
                        <div
                          className="h-full rounded-full bg-orange-500 transition-[width] duration-500"
                          style={{ width: `${book.progress}%` }}
                        />
                      </div>
                      <span className="mt-1 self-start rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-zinc-600">
                        {book.shelf}
                      </span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <Drawer.Root open={activeBook !== null} onOpenChange={(open) => !open && setActiveBook(null)}>
          <Drawer.Portal>
            <Drawer.Overlay className="fixed inset-0 z-60 bg-black/35" />
            <Drawer.Content className="fixed bottom-0 left-0 right-0 z-70 mx-auto flex max-h-[88dvh] max-w-lg flex-col rounded-t-3xl bg-white outline-none">
              <div className="mx-auto mt-3 h-1 w-12 shrink-0 rounded-full bg-zinc-200" />
              {activeBook && (
                <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-2 sm:px-6">
                  <div className="flex gap-4 border-b border-zinc-100 pb-5">
                    <div className="h-28 w-20 shrink-0 overflow-hidden rounded-xl bg-zinc-100">
                      <img
                        src={activeBook.cover}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold uppercase tracking-wide text-orange-500">
                        {activeBook.category}
                      </p>
                      <Drawer.Title className="mt-1 text-xl font-bold leading-snug text-zinc-950">
                        {activeBook.title}
                      </Drawer.Title>
                      <p className="mt-1 text-sm text-zinc-500">by {activeBook.author}</p>
                    </div>
                  </div>
                  <Drawer.Description className="mt-4 text-sm leading-relaxed text-zinc-600">
                    {activeBook.blurb}
                  </Drawer.Description>
                  <div className="mt-4">
                    <div className="mb-1 flex justify-between text-xs text-zinc-500">
                      <span>Progress</span>
                      <span>{activeBook.progress}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-zinc-100">
                      <div
                        className="h-full rounded-full bg-orange-500"
                        style={{ width: `${activeBook.progress}%` }}
                      />
                    </div>
                  </div>
                  <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                    <Link
                      href={`/read/${activeBook.id}`}
                      className="inline-flex min-h-12 flex-1 items-center justify-center rounded-xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-500"
                    >
                      Continue reading
                    </Link>
                    <Drawer.Close asChild>
                      <button
                        type="button"
                        className="inline-flex min-h-12 flex-1 items-center justify-center rounded-xl border border-zinc-200 px-4 py-3 text-sm font-semibold text-zinc-800 transition-colors hover:bg-zinc-50"
                      >
                        Close
                      </button>
                    </Drawer.Close>
                  </div>
                </div>
              )}
            </Drawer.Content>
          </Drawer.Portal>
        </Drawer.Root>
      </main>
      <Footer />
    </>
  );
}
