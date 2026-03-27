"use client";

import Link from "next/link";
import { Drawer } from "vaul";
import { useEffect, useRef } from "react";

export default function Trending() {
  const sliderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) {
      return;
    }

    const interval = window.setInterval(() => {
      const firstCard = slider.querySelector("article");
      if (!firstCard) {
        return;
      }

      const cardWidth = (firstCard as HTMLElement).offsetWidth;
      const gap = 28;
      const nextStep = cardWidth + gap;
      const maxScrollLeft = slider.scrollWidth - slider.clientWidth;

      if (slider.scrollLeft + nextStep >= maxScrollLeft - 4) {
        slider.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        slider.scrollBy({ left: nextStep, behavior: "smooth" });
      }
    }, 3200);

    return () => window.clearInterval(interval);
  }, []);

  const stories = [
    {
      id: 1,
      title: "The Midnight Library",
      author: "Sarah Chen",
      category: "Fantasy",
      blurb: "A strange archive opens only at midnight, where every shelf reveals a life she could have lived.",
      reads: "2.3M",
      rating: 4.8,
      cover:
        "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: 2,
      title: "Echo Of Tomorrow",
      author: "Marcus Rivera",
      category: "Sci-Fi",
      blurb: "A rogue signal from the future forces a data archivist to rewrite the present before dawn.",
      reads: "1.9M",
      rating: 4.7,
      cover:
        "https://images.unsplash.com/photo-1495640388908-05fa85288e61?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: 3,
      title: "Whispers In The Garden",
      author: "Elena Rodriguez",
      category: "Romance",
      blurb: "Letters hidden beneath an old rose arbor connect two strangers across seasons and second chances.",
      reads: "2.1M",
      rating: 4.9,
      cover:
        "https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: 4,
      title: "The Last Word",
      author: "James Murphy",
      category: "Mystery",
      blurb: "An editor receives a manuscript that predicts crimes before they happen, line by line.",
      reads: "1.7M",
      rating: 4.6,
      cover:
        "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=900&q=80",
    },
  ];

  return (
    <section className="bg-zinc-50 px-6 py-20 md:px-12 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-orange-500">Hot Shelf</p>
          <h2 className="mb-4 text-4xl font-bold tracking-tight text-zinc-950 md:text-5xl">Trending Now</h2>
          <p className="text-lg text-zinc-600">The stories readers are bingeing this week.</p>
        </div>

        <div
          ref={sliderRef}
          className="flex gap-7 overflow-x-auto px-1 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
            {stories.map((story) => (
              <article
                key={story.id}
                className="min-w-0 flex-[0_0_78%] sm:flex-[0_0_54%] md:flex-[0_0_39%] lg:flex-[0_0_30%] xl:flex-[0_0_23%]"
              >
                <div className="group relative h-full rounded-r-2xl rounded-l-md border border-zinc-200 bg-white p-3 shadow-[0_6px_24px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_36px_rgba(0,0,0,0.14)]">
                  <span className="absolute left-0 top-0 h-full w-2 rounded-l-md bg-linear-to-b from-orange-400 to-orange-600" />

                  <div className="relative h-52 overflow-hidden rounded-r-xl rounded-l-sm">
                    <img
                      src={story.cover}
                      alt={`${story.title} cover`}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <span className="absolute left-3 top-3 rounded-full bg-black/75 px-3 py-1 text-xs font-semibold text-white">
                      {story.category}
                    </span>
                  </div>

                  <div className="px-2 pb-2 pt-4">
                    <h3 className="mb-1 text-lg font-semibold text-zinc-950">{story.title}</h3>
                    <p className="mb-3 text-sm text-zinc-600">by {story.author}</p>

                    <div className="mb-4 flex items-center justify-between text-xs text-zinc-500">
                      <span>{story.reads} reads</span>
                      <span>★ {story.rating}</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Link
                        href="/discover"
                        className="inline-flex flex-1 items-center justify-center rounded-full bg-orange-500 px-3 py-2 text-xs font-semibold text-white transition-colors duration-300 hover:bg-black"
                      >
                        Binge Read
                      </Link>

                      <button
                        type="button"
                        className="inline-flex flex-1 items-center justify-center rounded-full border border-zinc-300 px-3 py-2 text-xs font-semibold text-zinc-700 transition-colors duration-300 hover:border-zinc-900 hover:text-zinc-900"
                      >
                        Save for later
                      </button>

                      <Drawer.Root>
                        <Drawer.Trigger asChild>
                          <button
                            type="button"
                            className="inline-flex w-full items-center justify-center rounded-full border border-zinc-300 px-3 py-2 text-xs font-semibold text-zinc-700 transition-colors duration-300 hover:border-orange-500 hover:text-orange-500"
                          >
                            Peek Blurb
                          </button>
                        </Drawer.Trigger>
                        <Drawer.Portal>
                          <Drawer.Overlay className="fixed inset-0 z-60 bg-black/45" />
                          <Drawer.Content className="fixed bottom-0 left-0 right-0 z-70 mx-auto max-w-2xl rounded-t-3xl bg-white p-6 shadow-2xl outline-none">
                            <div className="mx-auto mb-4 h-1.5 w-14 rounded-full bg-zinc-300" />
                            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-orange-500">{story.category}</p>
                            <Drawer.Title asChild>
                              <h4 className="mb-1 text-2xl font-bold text-zinc-950">{story.title}</h4>
                            </Drawer.Title>
                            <p className="mb-4 text-sm text-zinc-500">by {story.author}</p>
                            <Drawer.Description asChild>
                              <p className="mb-6 leading-relaxed text-zinc-700">{story.blurb}</p>
                            </Drawer.Description>
                            <div className="flex gap-2">
                              <Link
                                href="/discover"
                                className="inline-flex flex-1 items-center justify-center rounded-full bg-orange-500 px-4 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:bg-black"
                              >
                                Open Story
                              </Link>
                              <Drawer.Close asChild>
                                <button
                                  type="button"
                                  className="inline-flex flex-1 items-center justify-center rounded-full border border-zinc-300 px-4 py-3 text-sm font-semibold text-zinc-700 transition-colors duration-300 hover:border-zinc-900 hover:text-zinc-900"
                                >
                                  Close
                                </button>
                              </Drawer.Close>
                            </div>
                          </Drawer.Content>
                        </Drawer.Portal>
                      </Drawer.Root>
                    </div>
                  </div>
                </div>
              </article>
            ))}
        </div>
      </div>
    </section>
  );
}
