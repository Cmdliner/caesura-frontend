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
      {/* Scrim keeps text legible over the photo */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/65 to-black/80" />

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
        <p className="eyebrow eyebrow-light mb-6">Stories that move you</p>

        <h1 className="text-5xl md:text-7xl font-black font-brand text-white mb-6 leading-[1.05]">
          Stories Worth
          <br />
          <span className="text-orange-400">Reading</span>
        </h1>

        <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
          Discover original stories from emerging writers, track your reading progress,
          and build a library that&apos;s truly yours.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <Link href="/discover" className="btn btn-primary btn-lg">
            Start Reading
          </Link>
          <Link href="/create-story" className="btn btn-outline-light btn-lg">
            Start Writing
          </Link>
        </div>

        {/* Social proof */}
        <p className="mt-8 text-sm text-white/50 font-medium">
          Join <span className="text-white/80 font-semibold">50M+</span> readers worldwide
        </p>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden flex-col items-center gap-1.5 opacity-60 [@media(min-height:760px)]:flex">
        <span className="text-[11px] text-white/70 uppercase tracking-widest font-medium">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-white/60 to-transparent" />
      </div>
    </section>
  );
}
