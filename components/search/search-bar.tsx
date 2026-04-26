"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { booksAPI } from "@/lib/api/books";

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function SearchBar() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<API.BookSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedQuery = useDebounce(query, 280);

  // Fetch results when debounced query changes
  useEffect(() => {
    const q = debouncedQuery.trim();
    if (q.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    booksAPI
      .searchBooks(q)
      .then(setResults)
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [debouncedQuery]);

  // Reset selected index when results change
  useEffect(() => setSelected(-1), [results]);

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
    setResults([]);
    setSelected(-1);
  }, []);

  const navigate = useCallback(
    (slug: string) => {
      router.push(`/book/${slug}`);
      close();
    },
    [router, close]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelected((s) => Math.min(s + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelected((s) => Math.max(s - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selected >= 0 && results[selected]) {
        navigate(results[selected].slug);
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
          placeholder="Search stories…"
          className="flex-1 min-w-0 bg-transparent text-xs text-zinc-700 placeholder:text-zinc-400 focus:outline-none"
          autoComplete="off"
          spellCheck={false}
        />
        {query && (
          <button
            type="button"
            onClick={() => { setQuery(""); setResults([]); inputRef.current?.focus(); }}
            className="cursor-pointer flex-shrink-0 text-zinc-400 hover:text-zinc-700 transition-colors"
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
        <div className="absolute top-full left-0 mt-2 w-[320px] bg-white rounded-2xl border border-zinc-200 shadow-[0_8px_32px_rgba(0,0,0,0.12)] overflow-hidden z-50 animate-scale-in">
          {results.length === 0 && !loading ? (
            <div className="px-4 py-8 text-center">
              <p className="text-[13px] font-semibold text-zinc-500">No results for &ldquo;{query}&rdquo;</p>
              <p className="text-xs text-zinc-400 mt-1">Try a different title or author name</p>
            </div>
          ) : (
            <>
              <div className="max-h-[360px] overflow-y-auto">
                {results.map((book, i) => {
                  const author = book.authors?.length ? book.authors[0] : book.author_name;
                  return (
                    <button
                      key={book.id}
                      type="button"
                      onClick={() => navigate(book.slug)}
                      onMouseEnter={() => setSelected(i)}
                      className={`cursor-pointer w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                        selected === i ? "bg-zinc-50" : "hover:bg-zinc-50"
                      }`}
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

                      <svg className="h-3.5 w-3.5 text-zinc-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
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
                  className="cursor-pointer w-full text-left text-[12px] text-zinc-500 hover:text-zinc-800 font-semibold transition-colors"
                >
                  See all results for &ldquo;{query}&rdquo; →
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
