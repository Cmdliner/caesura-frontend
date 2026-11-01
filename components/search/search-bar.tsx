"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { PersonAvatar } from "@/components/people/person-card";
import { booksAPI } from "@/lib/api/books";
import { peopleAPI } from "@/lib/api/people";

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

// Stories and people share one list so the arrow keys move through both.
type Hit = { type: "book"; book: API.BookSummary } | { type: "person"; person: API.Person };

const PEOPLE_LIMIT = 4;

export default function SearchBar() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState<API.BookSummary[]>([]);
  const [people, setPeople] = useState<API.Person[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedQuery = useDebounce(query, 280);

  // Fetch results when debounced query changes
  useEffect(() => {
    const q = debouncedQuery.trim();
    if (q.length < 2) {
      setBooks([]);
      setPeople([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    // A failure in one list shouldn't hide the other.
    Promise.all([
      booksAPI.searchBooks(q).catch(() => [] as API.BookSummary[]),
      peopleAPI
        .search({ q, limit: PEOPLE_LIMIT })
        .then((r) => r.items)
        .catch(() => [] as API.Person[]),
    ])
      .then(([b, p]) => {
        setBooks(b);
        setPeople(p);
      })
      .finally(() => setLoading(false));
  }, [debouncedQuery]);

  const hits: Hit[] = [
    ...books.map((book): Hit => ({ type: "book", book })),
    ...people.map((person): Hit => ({ type: "person", person })),
  ];

  // Reset selected index when results change
  useEffect(() => setSelected(-1), [books, people]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setBooks([]);
    setPeople([]);
    setSelected(-1);
  }, []);

  const go = useCallback(
    (hit: Hit) => {
      router.push(hit.type === "book" ? `/book/${hit.book.slug}` : `/u/${hit.person.username}`);
      close();
    },
    [router, close]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelected((s) => Math.min(s + 1, hits.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelected((s) => Math.max(s - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selected >= 0 && hits[selected]) {
        go(hits[selected]);
      } else if (query.trim().length >= 2) {
        router.push(`/discover?q=${encodeURIComponent(query.trim())}`);
        close();
      }
    } else if (e.key === "Escape") {
      close();
      inputRef.current?.blur();
    }
  };

  const showDropdown = open && query.trim().length >= 2;

  const rowClass = (i: number) =>
    `cursor-pointer w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
      selected === i ? "bg-zinc-50" : "hover:bg-zinc-50"
    }`;

  return (
    <div ref={containerRef} className="relative">
      {/* Input */}
      <div
        className={`flex items-center gap-2 px-3 py-2 rounded-full border transition-all duration-200 w-[190px] ${
          open
            ? "border-zinc-400 bg-white w-[240px] shadow-sm"
            : "border-zinc-200 bg-zinc-50 hover:border-zinc-300 hover:bg-white"
        }`}
      >
        {loading ? (
          <svg className="h-3.5 w-3.5 flex-shrink-0 text-zinc-400 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
        ) : (
          <svg className="h-3.5 w-3.5 flex-shrink-0 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        )}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search stories and people…"
          className="flex-1 min-w-0 bg-transparent text-xs text-zinc-700 placeholder:text-zinc-400 focus:outline-none"
          autoComplete="off"
          spellCheck={false}
        />
        {query && (
          <button
            type="button"
            onClick={() => { setQuery(""); setBooks([]); setPeople([]); inputRef.current?.focus(); }}
            className="flex-shrink-0 text-zinc-400 hover:text-zinc-700 transition-colors"
            aria-label="Clear search"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute top-full left-0 mt-2 w-[320px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl border border-zinc-200 shadow-[0_8px_32px_rgba(0,0,0,0.12)] overflow-hidden z-50 animate-scale-in">
          {hits.length === 0 && !loading ? (
            <div className="px-4 py-8 text-center">
              <p className="text-[13px] font-semibold text-zinc-500">No results for &ldquo;{query}&rdquo;</p>
              <p className="text-xs text-zinc-400 mt-1">Try a different title, author or username</p>
            </div>
          ) : (
            <>
              <div className="max-h-[360px] overflow-y-auto">
                {books.length > 0 && <p className="eyebrow px-4 pb-1 pt-3 !text-zinc-500">Stories</p>}
                {books.map((book, i) => {
                  const author = book.authors?.length ? book.authors[0] : book.author_name;
                  return (
                    <button
                      key={book.id}
                      type="button"
                      onClick={() => go(hits[i])}
                      onMouseEnter={() => setSelected(i)}
                      className={rowClass(i)}
                    >
                      {/* Micro cover */}
                      <div className="h-10 w-7 rounded-md flex-shrink-0 overflow-hidden bg-zinc-100">
                        {book.cover_url ? (
                          <img src={book.cover_url} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full bg-zinc-200 flex items-center justify-center">
                            <span className="text-[10px] font-black text-zinc-400">
                              {book.title[0]?.toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold text-zinc-900 truncate leading-tight">
                          {book.title}
                        </p>
                        {author && (
                          <p className="text-[11px] text-zinc-400 truncate mt-0.5">{author}</p>
                        )}
                      </div>

                      <ChevronRight className="h-3.5 w-3.5 text-zinc-300 flex-shrink-0" />
                    </button>
                  );
                })}

                {people.length > 0 && <p className="eyebrow px-4 pb-1 pt-3 !text-zinc-500">People</p>}
                {people.map((person, j) => {
                  const i = books.length + j;
                  return (
                    <button
                      key={person.id}
                      type="button"
                      onClick={() => go(hits[i])}
                      onMouseEnter={() => setSelected(i)}
                      className={rowClass(i)}
                    >
                      <PersonAvatar person={person} className="h-9 w-9 text-sm" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold text-zinc-900 truncate leading-tight">
                          {person.display_name || person.username}
                        </p>
                        <p className="text-[11px] text-zinc-400 truncate mt-0.5">@{person.username}</p>
                      </div>
                      <ChevronRight className="h-3.5 w-3.5 text-zinc-300 flex-shrink-0" />
                    </button>
                  );
                })}
              </div>

              {/* Footer: "see all" */}
              <div className="border-t border-zinc-100 px-4 py-2.5">
                <button
                  type="button"
                  onClick={() => {
                    router.push(`/discover?q=${encodeURIComponent(query.trim())}`);
                    close();
                  }}
                  className="w-full text-left text-[12px] text-zinc-500 hover:text-zinc-800 font-semibold transition-colors"
                >
                  See all stories for &ldquo;{query}&rdquo; →
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
