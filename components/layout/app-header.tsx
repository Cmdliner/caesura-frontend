"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/app/providers/auth-provider";

interface AppHeaderProps {
  title?: string;
  showBackButton?: boolean;
  onBack?: () => void;
}

export default function AppHeader({
  title,
  showBackButton = false,
  onBack,
}: AppHeaderProps) {
  const { user, isAuthenticated } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-zinc-200 h-16 flex items-center px-4 sm:px-6">
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Logo / Back Button */}
        <div className="flex items-center gap-4">
          {showBackButton && onBack ? (
            <button
              onClick={onBack}
              className="p-2 rounded-lg hover:bg-zinc-100 transition-colors"
              aria-label="Go back"
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          ) : (
            <Link
              href="/"
              className="text-2xl font-black font-brand text-black"
              aria-label="Caesura Home"
            >
              Caesura
            </Link>
          )}
        </div>

        {/* Center: Title */}
        {title && (
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-zinc-900 truncate">
              {title}
            </h1>
          </div>
        )}

        {/* Right: Navigation & User Menu */}
        <div className="flex items-center gap-6 flex-shrink-0">
          {/* Navigation Links */}
          <nav className="hidden sm:flex items-center gap-6">
            <Link
              href="/discover"
              className="text-sm font-medium text-zinc-700 hover:text-zinc-900 transition-colors"
            >
              Discover
            </Link>
            <Link
              href="/library"
              className="text-sm font-medium text-zinc-700 hover:text-zinc-900 transition-colors"
            >
              Library
            </Link>
            <Link
              href="/write"
              className="text-sm font-medium text-zinc-700 hover:text-zinc-900 transition-colors"
            >
              Write
            </Link>
          </nav>

          {/* User Menu */}
          {isAuthenticated && user && (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-zinc-100 transition-colors"
              >
                {user.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user.display_name || user.username}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-sm font-semibold">
                    {user.display_name?.[0] || user.username?.[0] || "U"}
                  </div>
                )}
                <svg
                  className={`h-4 w-4 text-zinc-600 transition-transform ${
                    showUserMenu ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg border border-zinc-200 shadow-lg py-2 z-50">
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 transition-colors"
                  >
                    <div className="font-medium">
                      {user.display_name || user.username}
                    </div>
                    <div className="text-xs text-zinc-500">{user.email}</div>
                  </Link>
                  <hr className="my-2" />
                  <Link
                    href="/library"
                    className="block px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 transition-colors"
                  >
                    My Library
                  </Link>
                  <Link
                    href="/write"
                    className="block px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 transition-colors"
                  >
                    Write a Story
                  </Link>
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 transition-colors"
                  >
                    Profile Settings
                  </Link>
                  <hr className="my-2" />
                  <button
                    onClick={() => {
                      // Call logout
                      setShowUserMenu(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-zinc-50 transition-colors"
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
