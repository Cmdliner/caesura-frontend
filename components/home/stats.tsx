"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Stat = {
  value: number;
  label: string;
  suffix?: string;
};

export default function Stats() {
  const stats: Stat[] = [
    { value: 50_000_000, label: "Active Readers", suffix: "+" },
    { value: 500_000, label: "Stories Published", suffix: "+" },
    { value: 150, label: "Countries Worldwide", suffix: "+" },
    { value: 1_000_000_000, label: "Total Reads", suffix: "+" },
  ];

  const [hasAnimated, setHasAnimated] = useState(false);
  const [counts, setCounts] = useState(() => stats.map(() => 0));
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasAnimated(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasAnimated) {
      return;
    }

    const durationMs = 1500;
    const startedAt = performance.now();

    const step = (now: number) => {
      const progress = Math.min((now - startedAt) / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      setCounts(stats.map((stat) => Math.floor(stat.value * eased)));

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [hasAnimated]);

  const displayCounts = useMemo(
    () =>
      counts.map((value, index) => {
        const suffix = stats[index].suffix ?? "";
        return `${formatCompact(value)}${suffix}`;
      }),
    [counts]
  );

  return (
    <section ref={sectionRef} className="bg-black px-6 py-20 md:px-12 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-orange-500">Scale</p>
          <h2 className="mb-4 text-4xl font-bold tracking-tight text-white md:text-5xl">Join The Global Community</h2>
          <p className="text-lg text-zinc-300">A thriving platform where great stories find the right audience.</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <article
              key={stat.label}
              className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-6 text-center transition-colors duration-300 hover:border-orange-500/50"
            >
              <p className="mb-2 text-4xl font-bold text-orange-500 md:text-5xl">{displayCounts[index]}</p>
              <p className="text-sm font-medium tracking-wide text-zinc-300">{stat.label}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function formatCompact(value: number): string {
  if (value >= 1_000_000_000) {
    return `${Math.floor(value / 100_000_000) / 10}B`;
  }

  if (value >= 1_000_000) {
    return `${Math.floor(value / 100_000) / 10}M`;
  }

  if (value >= 1_000) {
    return `${Math.floor(value / 100) / 10}K`;
  }

  return `${value}`;
}
