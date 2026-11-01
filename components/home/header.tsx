"use client";

import { avatarSrc } from "@/lib/avatars";
import Link from "next/link";
import Logo from "@/components/ui/logo";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { BookOpen, Compass, PenLine, Shapes, Smartphone, Users } from "lucide-react";
import MobileMenu from "@/components/layout/mobile-menu";
import MenuButton from "@/components/layout/menu-button";
import { useAuth } from "@/app/providers/auth-provider";
import { tokenManager, userManager } from "@/lib/utils";

const navItems = [
    { label: "Discover", href: "/discover", icon: Compass },
    { label: "Genres", href: "/genres", icon: Shapes },
    { label: "Library", href: "/library", icon: BookOpen },
    { label: "Write", href: "/write", icon: PenLine },
    { label: "Community", href: "/community", icon: Users },
];

// The mobile menu also links to the download page; the desktop bar stays uncluttered.
const mobileItems = [...navItems, { label: "Get the app", href: "/download", icon: Smartphone }];

export default function Header({ solid = false }: { solid?: boolean }) {
    const router = useRouter();
    const { isAuthenticated, user, setUser } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Transparent over the hero, solid once the page scrolls.
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 24);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        if (!showUserMenu) return;

        const onPointerDown = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowUserMenu(false);
            }
        };
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") setShowUserMenu(false);
        };
        document.addEventListener("mousedown", onPointerDown);
        document.addEventListener("keydown", onKeyDown);
        return () => {
            document.removeEventListener("mousedown", onPointerDown);
            document.removeEventListener("keydown", onKeyDown);
        };
    }, [showUserMenu]);

    const handleLogout = () => {
        tokenManager.removeToken();
        userManager.removeUser();
        setUser(null);
        setShowUserMenu(false);
        setIsOpen(false);
        router.push("/");
    };

    // Over the hero the bar is transparent with light text; otherwise solid with dark text.
    // Transparent-with-white-text only over a hero; pages without one pass `solid`.
    const light = !scrolled && !solid;
    const linkColor = light ? "text-white/85 hover:text-white" : "text-zinc-600 hover:text-zinc-950";
    const underline = light ? "bg-white" : "bg-zinc-950";

    return (
        <header
            className={`pointer-events-none fixed inset-x-0 top-0 z-50 px-3 transition-[padding] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:px-6 ${
                scrolled ? "pt-3" : "pt-0"
            }`}
        >
            {/* The bar: full-width and transparent over the hero, then it shrinks into a floating pill. */}
            <div
                className={`pointer-events-auto relative z-10 mx-auto grid w-full grid-cols-[1fr_auto] items-center gap-6 md:grid-cols-[auto_1fr_auto] border transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    scrolled
                        ? "h-14 rounded-2xl border-zinc-200/80 bg-white/95 px-5 shadow-[0_8px_30px_rgba(0,0,0,0.12)] backdrop-blur-xl md:rounded-full md:px-6"
                        : "h-16 rounded-none border-transparent bg-transparent px-2 md:px-12"
                }`}
                style={{ maxWidth: scrolled ? 960 : 1280 }}
            >
                <Logo tone={light ? "light" : "dark"} />

                {/* Desktop navigation */}
                <nav aria-label="Main navigation" className="hidden justify-self-center md:block">
                    <ul className="flex items-center gap-6 whitespace-nowrap lg:gap-8">
                        {navItems.map((item) => (
                            <li key={item.label}>
                                <Link
                                    href={item.href}
                                    className={`group relative block py-1 text-sm font-medium transition-colors duration-150 ${linkColor}`}
                                >
                                    {item.label}
                                    <span
                                        aria-hidden="true"
                                        className={`absolute inset-x-0 -bottom-0.5 h-0.5 origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100 ${underline}`}
                                    />
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Desktop auth */}
                <div className="hidden justify-self-end md:block">
                    {!isAuthenticated ? (
                        <Link href="/login" className="btn btn-primary btn-md px-6">
                            Login
                        </Link>
                    ) : (
                        <div className="relative" ref={menuRef}>
                            <button
                                type="button"
                                onClick={() => setShowUserMenu((v) => !v)}
                                aria-expanded={showUserMenu}
                                aria-haspopup="menu"
                                className={`flex items-center gap-2 rounded-full py-1 pl-1 pr-3 transition-colors duration-150 ${
                                    light ? "text-white hover:bg-white/10" : "text-zinc-800 hover:bg-zinc-100"
                                }`}
                            >
                                {avatarSrc(user?.avatar_url) ? (
                                    <img src={avatarSrc(user?.avatar_url)} alt="" className="h-8 w-8 rounded-full object-cover" />
                                ) : (
                                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-600 text-sm font-semibold text-white">
                                        {user?.username?.[0]?.toUpperCase() || "U"}
                                    </span>
                                )}
                                <span className="text-sm font-medium">{user?.username || "Profile"}</span>
                            </button>

                            {showUserMenu && (
                                <div
                                    role="menu"
                                    className="animate-fade-down absolute right-0 mt-2 w-52 overflow-hidden rounded-xl border border-zinc-200 bg-white py-1.5 text-zinc-800 shadow-[0_8px_32px_rgba(0,0,0,0.12)]"
                                >
                                    {[
                                        { href: "/library", label: "My Library" },
                                        { href: "/write", label: "Write a Story" },
                                        { href: "/profile", label: "Profile" },
                                    ].map((item) => (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            role="menuitem"
                                            onClick={() => setShowUserMenu(false)}
                                            className="block px-4 py-2.5 text-sm transition-colors hover:bg-zinc-50"
                                        >
                                            {item.label}
                                        </Link>
                                    ))}
                                    <div className="my-1 border-t border-zinc-100" />
                                    <button
                                        type="button"
                                        role="menuitem"
                                        onClick={handleLogout}
                                        className="block w-full px-4 py-2.5 text-left text-sm text-red-600 transition-colors hover:bg-red-50"
                                    >
                                        Sign out
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Mobile menu button */}
                <MenuButton
                    onClick={() => setIsOpen(true)}
                    expanded={isOpen}
                    tone={light ? "light" : "dark"}
                    className="justify-self-end md:hidden"
                />
            </div>

            <MobileMenu
                open={isOpen}
                onClose={() => setIsOpen(false)}
                links={mobileItems}
                isAuthenticated={isAuthenticated}
                user={user}
                onLogout={handleLogout}
            />
        </header>
    );
}
