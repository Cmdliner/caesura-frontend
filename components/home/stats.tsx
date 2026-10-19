"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { BookOpen, Eye, Globe, Users, type LucideIcon } from "lucide-react";
import SectionHeading from "@/components/ui/section-heading";
import { DotPattern, Splash } from "@/components/ui/patterns";
import WaveDivider from "@/components/ui/wave-divider";

type Stat = {
  value: number;
  label: string;
  suffix?: string;
  icon: LucideIcon;
};

export default function Stats() {
  const stats: Stat[] = [
    { value: 50_000_000, label: "Active Readers", suffix: "+", icon: Users },
    { value: 500_000, label: "Stories Published", suffix: "+", icon: BookOpen },
    { value: 150, label: "Countries Worldwide", suffix: "+", icon: Globe },
    { value: 1_000_000_000, label: "Total Reads", suffix: "+", icon: Eye },
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
    <section ref={sectionRef} className="section bg-zinc-950 !pb-32 !pt-32 md:!pb-44 md:!pt-44">
      {/* Wavy edges: each takes the colour of the neighbouring section (Trending above, Testimonials below) */}
      <WaveDivider position="top" variant="a" className="text-brand-50" />
      <WaveDivider position="bottom" variant="b" className="text-zinc-50" />

      <Splash variant="a" className="-left-32 -top-40 h-[28rem] w-[28rem] text-brand-600/15" />
      <Splash variant="b" className="-bottom-28 -right-24 h-72 w-[26rem] text-brand-600/10" />
      <DotPattern className="inset-0 text-white/[0.07] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />

      <div className="container-page relative">
        <SectionHeading
          tone="dark"
          eyebrow="Scale"
          title="Join the global community"
          description="A thriving platform where great stories find the right audience."
          className="mb-14"
        />

        <dl className="grid grid-cols-2 gap-y-12 lg:grid-cols-4 lg:gap-y-0 lg:[&>div+div]:border-l lg:[&>div+div]:border-white/10">
          {stats.map((stat, index) => (
            <div key={stat.label} className="px-4 text-center">
              <stat.icon className="mx-auto mb-4 h-6 w-6 text-brand-400" strokeWidth={1.6} />
              <dd className="text-4xl font-bold tracking-tight text-white tabular-nums md:text-5xl">{displayCounts[index]}</dd>
              <dt className="mt-2 text-sm font-medium text-zinc-400">{stat.label}</dt>
            </div>
          ))}
        </dl>
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
