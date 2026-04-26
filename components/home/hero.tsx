"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Hero() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat pt-20"
      style={{ backgroundImage: "url('/images/hero-bg.avif')" }}
    >
      {/* Layered overlays for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/60 to-black/75" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 70% at 50% 42%, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.75) 100%)",
        }}
      />

      {/* Subtle warm glow at top */}
      <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-orange-900/20 to-transparent pointer-events-none" />

      {/* Content */}
      <div
        className="relative z-10 max-w-4xl px-6 md:px-12 text-center"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.7s ease, transform 0.7s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-orange-400 animate-pulse" />
          <span className="text-xs font-semibold text-white/80 tracking-widest uppercase">
            Stories that move you
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-black font-brand text-white mb-6 leading-[1.05] drop-shadow-lg">
          Stories Worth
          <br />
          <span className="text-orange-400">Reading</span>
        </h1>

        <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
          Discover original stories from emerging writers, track your reading progress,
          and build a library that&apos;s truly yours.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/discover"
            className="group relative px-8 py-4 bg-orange-500 text-white font-semibold rounded-full transition-all duration-300 shadow-lg shadow-orange-900/30 hover:bg-orange-400 hover:shadow-xl hover:shadow-orange-900/40 hover:-translate-y-0.5"
          >
            Start Reading
          </Link>
          <Link
            href="/create-story"
            className="px-8 py-4 border-2 border-white/60 text-white font-semibold rounded-full hover:bg-white hover:text-zinc-900 hover:border-white transition-all duration-300 hover:-translate-y-0.5"
          >
            Start Writing
          </Link>
        </div>

        {/* Social proof */}
        <p className="mt-8 text-sm text-white/50 font-medium">
          Join <span className="text-white/80 font-semibold">50M+</span> readers worldwide
        </p>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 opacity-60">
        <span className="text-[11px] text-white/70 uppercase tracking-widest font-medium">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-white/60 to-transparent" />
      </div>
    </section>
  );
}
