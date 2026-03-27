"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [bgColor, setBgColor] = useState("transparent");
    const [textColor, setTextColor] = useState("text-white");

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            const heroHeight = window.innerHeight;
            
            // Calculate transition: 0 to 1 as you scroll from hero start to end
            const transitionProgress = Math.min(scrollPosition / (heroHeight * 0.5), 1);
            
            // Determine if we're transitioning
            if (scrollPosition < heroHeight * 1.5) {
                // During transition (0% to 150% of hero height)
                const opacity = transitionProgress;
                setBgColor(`rgba(255, 255, 255, ${opacity})`);
                // Smoothly transition text color: white to black
                setTextColor(transitionProgress > 0.5 ? "text-black" : "text-white");
            } else {
                // Past hero, solid white
                setBgColor("rgba(255, 255, 255, 1)");
                setTextColor("text-black");
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navItems = [
        { label: "Discover", href: "/discover" },
        { label: "Genres", href: "/genres" },
        { label: "Library", href: "/library" },
        { label: "Write", href: "/write" },
        { label: "Community", href: "/community" },
    ];

    return (
        <header 
            className={`fixed top-0 left-0 right-0 z-50 px-6 py-6 md:px-24 transition-colors duration-150 ${textColor}`}
            style={{ backgroundColor: bgColor }}
        >
            <div className="mx-auto grid w-full max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-4">
                <Link href="/" className="text-5xl leading-none font-black font-brand" aria-label="Caesura Home">
                    Caesura
                </Link>

                {/* Desktop Navigation */}
                <nav aria-label="Main navigation" className="hidden justify-self-center md:block">
                    <ul className="flex items-center gap-3 whitespace-nowrap md:gap-5 lg:gap-6">
                        {navItems.map((item) => (
                            <li key={item.label}>
                                <Link
                                    href={item.href}
                                    className={`group relative block pb-1 text-base transition-colors duration-150 ${textColor}`}
                                >
                                    <span>{item.label}</span>
                                    <span
                                        aria-hidden="true"
                                        className={`absolute bottom-0 left-0 h-0.5 w-full origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100 ${textColor === "text-white" ? "bg-white" : "bg-black"}`}
                                    />
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Desktop Login Button */}
                <Link
                    href="/login"
                    className="hidden group relative justify-self-end rounded-full p-1 md:block"
                >
                    <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 rounded-full border-2 border-orange-500 opacity-0 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:border-black"
                    />
                    <span className="block rounded-full bg-orange-500 px-14 py-2 text-base font-semibold text-white transition-colors duration-300 ease-out group-hover:bg-black">
                        Login
                    </span>
                </Link>

                {/* Mobile Hamburger Button - Stylish Staggered Design */}
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className={`md:hidden cursor-pointer flex flex-col gap-2 justify-self-end items-end`}
                    aria-label="Toggle navigation"
                    aria-expanded={isOpen}
                >
                    <span className={`block h-0.5 transition-all duration-500 ease-out ${isOpen ? "w-5 absolute rotate-45" : "w-6"} ${textColor === "text-white" ? "bg-white" : "bg-black"}`} />
                    <span className={`block h-0.5 transition-all duration-500 ease-out ${isOpen ? "w-5 absolute -rotate-45" : "w-4"} ${textColor === "text-white" ? "bg-white" : "bg-black"}`} />
                    <span className={`block h-0.5 transition-all duration-500 ease-out ${isOpen ? "opacity-0" : "w-3"} ${textColor === "text-white" ? "bg-white" : "bg-black"}`} />
                </button>
            </div>

            {/* Mobile Navigation Drawer */}
            {isOpen && (
                <nav
                    className="md:hidden bg-white px-6 py-4 animate-in fade-in slide-in-from-top-2 duration-300"
                    aria-label="Mobile navigation"
                >
                    <ul className="flex flex-col gap-4 border-t border-gray-200 pt-4">
                        {navItems.map((item) => (
                            <li key={item.label}>
                                <Link
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className="group relative block text-lg text-black transition-colors duration-200 hover:text-gray-600"
                                >
                                    <span>{item.label}</span>
                                    <span
                                        aria-hidden="true"
                                        className="absolute bottom-0 left-0 h-0.5 w-full origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100 bg-black"
                                    />
                                </Link>
                            </li>
                        ))}
                        <li className="border-t border-gray-200 pt-4">
                            <Link
                                href="/login"
                                onClick={() => setIsOpen(false)}
                                className="group relative block w-full rounded-full border-2 border-transparent p-1 text-center transition-colors duration-300 hover:border-black"
                            >
                                <span className="block rounded-full bg-orange-500 px-6 py-3 text-base font-semibold text-white transition-colors duration-300 ease-out group-hover:bg-black">
                                    Login
                                </span>
                            </Link>
                        </li>
                    </ul>
                </nav>
            )}
        </header>
    );
}