"use client";

import { avatarSrc } from "@/lib/avatars";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Logo from "@/components/ui/logo";
import { useRouter, usePathname } from "next/navigation";
import {
  BookOpen,
  ChevronDown,
  Compass,
  LogOut,
  PenLine,
  Shapes,
  Smartphone,
  User,
  type LucideIcon,
} from "lucide-react";
import { useAuth } from "@/app/providers/auth-provider";
import { tokenManager, userManager } from "@/lib/utils";
import SearchBar from "@/components/search/search-bar";
import MobileMenu from "@/components/layout/mobile-menu";
import MenuButton from "@/components/layout/menu-button";

type NavItem = { label: string; href: string; icon: LucideIcon };

const publicLinks: NavItem[] = [
  { label: "Browse", href: "/discover", icon: Compass },
  { label: "Genres", href: "/genres", icon: Shapes },
];
const memberLinks: NavItem[] = [...publicLinks, { label: "Library", href: "/library", icon: BookOpen }];

/**
 * Navigation for every non-home page. A plain full-width bar that
 * stays pinned to the top. It is 60px tall, which is the offset pages reserve with pt-[60px].
 */
export default function AppNav() {
  const { user, isAuthenticated, isLoading, setUser } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const links = isAuthenticated ? memberLinks : publicLinks;
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  const handleLogout = () => {
    tokenManager.removeToken();
    userManager.removeUser();
    setUser(null);
    setShowUserMenu(false);
    setMobileOpen(false);
    router.push("/");
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setShowUserMenu(false);
  }, [pathname]);

  useEffect(() => {
    if (!showUserMenu) return;
    const onPointerDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setShowUserMenu(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowUserMenu(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [showUserMenu]);

  const name = user?.display_name || user?.username || "";
  const initials = (name || "U")[0].toUpperCase();

  const Avatar = ({ size }: { size: "sm" | "lg" }) => {
    const dims = size === "sm" ? "h-8 w-8 text-[13px]" : "h-11 w-11 text-base";
    return avatarSrc(user?.avatar_url) ? (
      <img src={avatarSrc(user?.avatar_url)} alt="" className={`${dims} rounded-full object-cover`} />
    ) : (
      <span className={`${dims} flex items-center justify-center rounded-full bg-brand-600 font-semibold text-white`}>
        {initials}
      </span>
    );
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b border-zinc-200 transition-[background-color,box-shadow] duration-200 ${
        scrolled ? "bg-white/90 shadow-[0_1px_12px_rgba(0,0,0,0.06)] backdrop-blur-xl" : "bg-white"
      }`}
    >
      <div className="relative z-10 mx-auto flex h-[60px] w-full max-w-7xl items-center gap-4 px-4 md:px-8">
        <Logo />

        {/* Desktop navigation */}
        <nav className="hidden flex-1 items-center gap-1 md:flex" aria-label="Main navigation">
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                isActive(item.href)
                  ? "bg-zinc-100 text-zinc-950"
                  : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-950"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="ml-auto hidden flex-shrink-0 items-center gap-2.5 md:flex">
          {isLoading ? null : !isAuthenticated ? (
            <>
              <Link href="/login" className="btn btn-outline btn-md">
                Log in
              </Link>
              <Link href="/signup" className="btn btn-primary btn-md">
                Sign up
              </Link>
            </>
          ) : (
            <>
              <SearchBar />
              <Link href="/write" className="btn btn-primary btn-md">
                <PenLine className="h-4 w-4" />
                Write
              </Link>

              {user && (
                <div className="relative" ref={menuRef}>
                  <button
                    type="button"
                    onClick={() => setShowUserMenu((v) => !v)}
                    className="flex items-center gap-1.5 rounded-full p-1 pr-2 transition-colors hover:bg-zinc-100"
                    aria-label="Account menu"
                    aria-expanded={showUserMenu}
                    aria-haspopup="menu"
                  >
                    <Avatar size="sm" />
                    <ChevronDown
                      className={`h-3.5 w-3.5 text-zinc-500 transition-transform duration-200 ${showUserMenu ? "rotate-180" : ""}`}
                    />
                  </button>

                  {showUserMenu && (
                    <div
                      role="menu"
                      className="animate-fade-down absolute right-0 mt-3 w-64 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-[0_12px_40px_rgba(0,0,0,0.14)]"
                    >
                      <div className="flex items-center gap-3 border-b border-zinc-100 p-4">
                        <Avatar size="lg" />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-zinc-950">{name}</p>
                          <p className="truncate text-xs text-zinc-500">@{user.username}</p>
                        </div>
                      </div>

                      <div className="p-1.5">
                        {[
                          { href: "/profile", label: "Profile", icon: User },
                          { href: "/library", label: "My library", icon: BookOpen },
                          { href: "/write", label: "My stories", icon: PenLine },
                        ].map(({ href, label, icon: Icon }) => (
                          <Link
                            key={href}
                            href={href}
                            role="menuitem"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-zinc-700 transition-colors hover:bg-zinc-50 hover:text-zinc-950"
                          >
                            <Icon className="h-4 w-4 text-zinc-400" />
                            {label}
                          </Link>
                        ))}
                      </div>

                      <div className="border-t border-zinc-100 p-1.5">
                        <button
                          type="button"
                          role="menuitem"
                          onClick={handleLogout}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50"
                        >
                          <LogOut className="h-4 w-4" />
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <MenuButton onClick={() => setMobileOpen(true)} expanded={mobileOpen} className="ml-auto md:hidden" />
      </div>

      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        links={[
          ...links,
          ...(isAuthenticated ? [{ label: "Write", href: "/write", icon: PenLine }] : []),
          { label: "Get the app", href: "/download", icon: Smartphone },
        ]}
        isActive={isActive}
        isAuthenticated={isAuthenticated}
        isLoading={isLoading}
        user={user}
        onLogout={handleLogout}
        top={isAuthenticated ? <SearchBar /> : undefined}
      />
    </header>
  );
}
