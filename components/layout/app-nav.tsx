"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/app/providers/auth-provider";
import { tokenManager, userManager } from "@/lib/utils";
import SearchBar from "@/components/search/search-bar";

export default function AppNav() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { label: "Browse", href: "/discover" },
    { label: "Library", href: "/library" },
    { label: "Write", href: "/write" },
  ];

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  const handleLogout = () => {
    tokenManager.removeToken();
    userManager.removeUser();
    setShowUserMenu(false);
    router.push("/");
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!isAuthenticated) return null;

  const initials = (user?.display_name || user?.username || "U")[0].toUpperCase();

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 h-[60px] flex items-center transition-all duration-200 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-[0_1px_0_0_#e4e4e7,0_4px_16px_rgba(0,0,0,0.06)]"
          : "bg-white border-b border-zinc-200"
      }`}
    >
      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 flex items-center gap-6">

        {/* Logo */}
        <Link
          href="/"
          className="flex-shrink-0 text-[22px] font-black font-brand text-zinc-900 tracking-tight hover:text-zinc-600 transition-colors"
          aria-label="Caesura Home"
        >
          Caesura
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-0.5 flex-1" aria-label="Main navigation">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`relative px-3.5 py-5 text-[13.5px] font-semibold transition-colors ${
                isActive(item.href)
                  ? "text-zinc-900"
                  : "text-zinc-500 hover:text-zinc-900"
              }`}
            >
              {item.label}
              {isActive(item.href) && (
                <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-zinc-900 rounded-t-full" />
              )}
            </Link>
          ))}
        </nav>

        {/* Right Side */}
        <div className="hidden md:flex items-center gap-2.5 flex-shrink-0 ml-auto">
          <SearchBar />

          <Link
            href="/write"
            className="cursor-pointer px-4 py-2 rounded-full bg-zinc-900 text-white text-[13px] font-semibold hover:bg-zinc-700 transition-colors flex-shrink-0"
          >
            Write
          </Link>

          {/* User menu */}
          {user && (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="cursor-pointer flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full hover:bg-zinc-100 transition-colors"
                aria-label="User menu"
                aria-expanded={showUserMenu}
              >
                {user.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user.username}
                    className="h-8 w-8 rounded-full object-cover ring-2 ring-white shadow-sm"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center text-white text-[13px] font-bold shadow-sm">
                    {initials}
                  </div>
                )}
                <svg
                  className={`h-3.5 w-3.5 text-zinc-500 transition-transform ${showUserMenu ? "rotate-180" : ""}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl border border-zinc-200 shadow-[0_8px_32px_rgba(0,0,0,0.12)] py-1.5 z-50 animate-fade-down">
                  <div className="px-4 py-3 border-b border-zinc-100">
                    {user.avatar_url ? (
                      <img src={user.avatar_url} alt="" className="h-10 w-10 rounded-full object-cover mb-2" />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center text-white font-bold mb-2">
                        {initials}
                      </div>
                    )}
                    <p className="text-sm font-bold text-zinc-900 truncate">
                      {user.display_name || user.username}
                    </p>
                    <p className="text-xs text-zinc-500 truncate">@{user.username}</p>
                  </div>

                  <div className="py-1">
                    {[
                      { href: "/profile", label: "Profile", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
                      { href: "/library", label: "My Library", icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" },
                      { href: "/write", label: "Write a Story", icon: "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" },
                    ].map(({ href, label, icon }) => (
                      <Link
                        key={href}
                        href={href}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 hover:bg-zinc-50 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <svg className="h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                        </svg>
                        {label}
                      </Link>
                    ))}
                  </div>

                  <div className="border-t border-zinc-100 pt-1">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="cursor-pointer w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="cursor-pointer md:hidden ml-auto flex flex-col justify-center gap-[5px] p-2 rounded-lg hover:bg-zinc-100 transition-colors"
          aria-label="Toggle menu"
        >
          <span className={`h-[2px] w-[22px] bg-zinc-800 rounded-full transition-all duration-200 origin-center ${isMobileMenuOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
          <span className={`h-[2px] w-[22px] bg-zinc-800 rounded-full transition-all duration-200 ${isMobileMenuOpen ? "opacity-0 scale-x-0" : ""}`} />
          <span className={`h-[2px] w-[22px] bg-zinc-800 rounded-full transition-all duration-200 origin-center ${isMobileMenuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 top-[60px] z-40 bg-black/30 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="absolute top-[60px] left-0 right-0 z-50 bg-white border-b border-zinc-200 shadow-lg md:hidden">
            {/* Mobile search */}
            <div className="px-4 pt-3 pb-2">
              <SearchBar />
            </div>

            <nav className="flex flex-col py-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center px-5 py-3.5 text-sm font-semibold transition-colors border-l-[3px] ${
                    isActive(item.href)
                      ? "border-zinc-900 text-zinc-900 bg-zinc-50"
                      : "border-transparent text-zinc-600 hover:bg-zinc-50"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {user && (
              <div className="border-t border-zinc-100 p-4 space-y-1">
                <div className="flex items-center gap-3 px-1 py-2 mb-2">
                  {user.avatar_url ? (
                    <img src={user.avatar_url} alt="" className="h-9 w-9 rounded-full object-cover" />
                  ) : (
                    <div className="h-9 w-9 rounded-full bg-zinc-800 flex items-center justify-center text-white font-bold text-sm">
                      {initials}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-zinc-900">{user.display_name || user.username}</p>
                    <p className="text-xs text-zinc-500">@{user.username}</p>
                  </div>
                </div>
                <Link href="/profile" className="block px-3 py-2.5 text-sm text-zinc-700 hover:bg-zinc-50 rounded-lg transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Profile</Link>
                <Link href="/library" className="block px-3 py-2.5 text-sm text-zinc-700 hover:bg-zinc-50 rounded-lg transition-colors" onClick={() => setIsMobileMenuOpen(false)}>My Library</Link>
                <button
                  type="button"
                  onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                  className="cursor-pointer w-full text-left px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </header>
  );
}
