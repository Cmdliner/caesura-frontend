"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/app/providers/auth-provider";

interface ReadingHeaderProps {
  bookTitle: string;
  chapterTitle?: string;
  onSidebarToggle: () => void;
  sidebarOpen: boolean;
}

export default function ReadingHeader({
  bookTitle,
  chapterTitle,
  onSidebarToggle,
  sidebarOpen,
}: ReadingHeaderProps) {
  const { user, isAuthenticated } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-zinc-200 h-16 flex items-center px-4 sm:px-6">
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Menu Toggle */}
        <button
          onClick={onSidebarToggle}
          className="flex-shrink-0 p-2 rounded-lg hover:bg-zinc-100 transition-colors"
          aria-label="Toggle chapter sidebar"
        >
          <svg
            className={`h-5 w-5 text-zinc-700 transition-transform ${
              sidebarOpen ? "scale-100" : "scale-100"
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Center: Book and Chapter Info */}
        <div className="flex-1 min-w-0">
          <p className="text-xs text-zinc-500 truncate">{bookTitle}</p>
          {chapterTitle && (
            <p className="text-sm font-medium text-zinc-900 truncate">
              {chapterTitle}
            </p>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Settings/Options */}
          <button
            className="p-2 rounded-lg hover:bg-zinc-100 transition-colors"
            aria-label="Reading options"
          >
            <svg
              className="h-5 w-5 text-zinc-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>

          {/* User Profile */}
          {isAuthenticated && user && (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-zinc-100 transition-colors"
              >
                {user.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user.display_name || user.username}
                    className="h-7 w-7 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-7 w-7 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-semibold">
                    {user.display_name?.[0] || user.username?.[0] || "U"}
                  </div>
                )}
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg border border-zinc-200 shadow-lg py-2 z-50">
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50"
                  >
                    Profile
                  </Link>
                  <Link
                    href="/library"
                    className="block px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50"
                  >
                    Library
                  </Link>
                  <hr className="my-2" />
                  <button
                    onClick={() => {
                      // Call logout
                      setShowUserMenu(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-zinc-50"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
