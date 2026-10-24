"use client";

import { avatarSrc } from "@/lib/avatars";
import Link from "next/link";
import Logo from "@/components/ui/logo";
import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { ChevronRight, LogOut, User as UserIcon, X, type LucideIcon } from "lucide-react";
import { DotPattern, Splash } from "@/components/ui/patterns";

export type MobileMenuLink = { label: string; href: string; icon: LucideIcon };

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  links: MobileMenuLink[];
  isActive?: (href: string) => boolean;
  isAuthenticated: boolean;
  /** True while auth state is still resolving; avoids flashing the wrong footer. */
  isLoading?: boolean;
  user: API.User | null;
  onLogout: () => void;
  /** Optional block above the links (e.g. the search bar). */
  top?: ReactNode;
}

/**
 * Slide-in menu for small screens, shared by the home header and AppNav.
 * Locks page scroll, closes on Escape / backdrop tap / navigation, and moves focus into the sheet.
 */
export default function MobileMenu({
  open,
  onClose,
  links,
  isActive = () => false,
  isAuthenticated,
  isLoading,
  user,
  onLogout,
  top,
}: MobileMenuProps) {
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // Move focus into the sheet (not onto a button) so keyboard/screen-reader users land inside it without a stray focus ring.
    panelRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  const name = user?.display_name || user?.username || "";

  // Portalled to <body>: the headers that render this get a backdrop-filter once scrolled, which would make
  // them the containing block for `fixed` and clip the sheet to the header's height.
  return createPortal(
    <div className="pointer-events-auto fixed inset-0 z-[70] md:hidden" role="dialog" aria-modal="true" aria-label="Menu">
      <button
        type="button"
        aria-label="Close menu"
        tabIndex={-1}
        onClick={onClose}
        className="animate-fade-in absolute inset-0 bg-zinc-950/55 backdrop-blur-sm"
      />

      <aside ref={panelRef} tabIndex={-1} className="animate-slide-in-right outline-none absolute right-0 top-0 flex h-full w-[min(88vw,22rem)] flex-col overflow-hidden bg-white shadow-[-20px_0_60px_rgba(0,0,0,0.25)]">
        {/* Decoration */}
        <Splash variant="a" className="-right-24 -top-28 h-64 w-64 text-brand-100" />
        <DotPattern className="bottom-24 right-0 h-40 w-40 text-zinc-300/60 [mask-image:linear-gradient(to_left,black,transparent)]" />

        {/* Header */}
        <div className="relative flex h-16 flex-shrink-0 items-center justify-between px-5">
          <Logo onClick={onClose} />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-zinc-700 transition-colors hover:bg-zinc-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Links */}
        <div className="relative flex-1 overflow-y-auto px-3 pb-4 pt-2">
          {top && <div className="mb-3 px-2">{top}</div>}

          <p className="eyebrow mb-2 px-3 !text-zinc-500">Menu</p>
          <nav aria-label="Mobile navigation" className="flex flex-col gap-1">
            {links.map(({ label, href, icon: Icon }, i) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={onClose}
                  aria-current={active ? "page" : undefined}
                  style={{ animationDelay: `${80 + i * 45}ms` }}
                  className={`animate-slide-right group flex items-center gap-4 rounded-2xl px-3 py-3 transition-colors ${
                    active ? "bg-brand-50" : "hover:bg-zinc-50"
                  }`}
                >
                  <span
                    className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl transition-colors ${
                      active ? "bg-brand-600 text-white" : "bg-zinc-100 text-zinc-600 group-hover:bg-brand-100 group-hover:text-brand-700"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className={`flex-1 text-[17px] font-semibold ${active ? "text-brand-700" : "text-zinc-900"}`}>{label}</span>
                  <ChevronRight className={`h-4 w-4 transition-transform group-hover:translate-x-0.5 ${active ? "text-brand-600" : "text-zinc-300"}`} />
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer: account or auth CTAs */}
        <div className="relative flex-shrink-0 border-t border-zinc-200 bg-zinc-50/80 p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] backdrop-blur">
          {isLoading ? null : isAuthenticated && user ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                {avatarSrc(user.avatar_url) ? (
                  <img src={avatarSrc(user.avatar_url)} alt="" className="h-11 w-11 rounded-full object-cover" />
                ) : (
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-600 text-base font-semibold text-white">
                    {(name || "U")[0].toUpperCase()}
                  </span>
                )}
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-zinc-950">{name}</p>
                  <p className="truncate text-xs text-zinc-500">@{user.username}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Link href="/profile" onClick={onClose} className="btn btn-outline btn-md">
                  <UserIcon className="h-4 w-4" />
                  Profile
                </Link>
                <button type="button" onClick={onLogout} className="btn btn-md border border-red-200 bg-white text-red-600 hover:bg-red-50">
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2.5">
              <Link href="/signup" onClick={onClose} className="btn btn-primary btn-lg w-full">
                Create free account
              </Link>
              <Link href="/login" onClick={onClose} className="btn btn-outline btn-lg w-full">
                Log in
              </Link>
            </div>
          )}
        </div>
      </aside>
    </div>,
    document.body,
  );
}
