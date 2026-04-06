"use client";

import { useEffect, useRef } from "react";
import BookCard from "@/components/books/book-card";

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
      id: "1",
      slug: "the-midnight-library",
      title: "The Midnight Library",
      author: "Sarah Chen",
      category: "Fantasy",
      description: "A strange archive opens only at midnight, where every shelf reveals a life she could have lived.",
      total_views: 2300000,
      rating: 4.8,
      cover_url:
        "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: "2",
      slug: "echo-of-tomorrow",
      title: "Echo Of Tomorrow",
      author: "Marcus Rivera",
      category: "Sci-Fi",
      description: "A rogue signal from the future forces a data archivist to rewrite the present before dawn.",
      total_views: 1900000,
      rating: 4.7,
      cover_url:
        "https://images.unsplash.com/photo-1495640388908-05fa85288e61?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: "3",
      slug: "whispers-in-the-garden",
      title: "Whispers In The Garden",
      author: "Elena Rodriguez",
      category: "Romance",
      description: "Letters hidden beneath an old rose arbor connect two strangers across seasons and second chances.",
      total_views: 2100000,
      rating: 4.9,
      cover_url:
        "https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: "4",
      slug: "the-last-word",
      title: "The Last Word",
      author: "James Murphy",
      category: "Mystery",
      description: "An editor receives a manuscript that predicts crimes before they happen, line by line.",
      total_views: 1700000,
      rating: 4.6,
      cover_url:
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
              <BookCard
                id={story.id}
                slug={story.slug}
                title={story.title}
                author={story.author}
                category={story.category}
                description={story.description}
                cover_url={story.cover_url}
                total_views={story.total_views}
                rating={story.rating}
                variant="featured"
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
