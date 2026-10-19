"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import BookCard from "@/components/books/book-card";
import SectionHeading from "@/components/ui/section-heading";
import { DotPattern, Splash } from "@/components/ui/patterns";

export default function Trending() {
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const pausedRef = useRef(false);

  const scrollByCard = (direction: 1 | -1) => {
    const slider = sliderRef.current;
    const firstCard = slider?.querySelector("article");
    if (!slider || !firstCard) return;
    slider.scrollBy({ left: direction * ((firstCard as HTMLElement).offsetWidth + 28), behavior: "smooth" });
  };

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) {
      return;
    }

    const interval = window.setInterval(() => {
      if (pausedRef.current) {
        return;
      }
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
    <section className="section bg-brand-50">
      <DotPattern className="inset-0 text-brand-200/70 [mask-image:linear-gradient(to_bottom,black,transparent_70%)]" />
      <Splash variant="b" className="-right-32 -top-16 hidden h-72 w-[26rem] text-brand-100 lg:block" />

      <div className="container-page relative">
        <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            align="left"
            eyebrow="Hot shelf"
            title="Trending now"
            description="The stories readers are bingeing this week."
          />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollByCard(-1)}
              aria-label="Previous stories"
              className="btn btn-outline h-11 w-11 !p-0"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => scrollByCard(1)}
              aria-label="Next stories"
              className="btn btn-outline h-11 w-11 !p-0"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <Link href="/discover" className="btn btn-dark btn-md ml-2 hidden sm:inline-flex">
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div
          ref={sliderRef}
          onMouseEnter={() => (pausedRef.current = true)}
          onMouseLeave={() => (pausedRef.current = false)}
          onFocus={() => (pausedRef.current = true)}
          onBlur={() => (pausedRef.current = false)}
          className="-mx-1 flex snap-x snap-mandatory gap-7 overflow-x-auto px-1 pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {stories.map((story) => (
            <article
              key={story.id}
              className="min-w-0 flex-[0_0_78%] snap-start sm:flex-[0_0_54%] md:flex-[0_0_39%] lg:flex-[0_0_30%] xl:flex-[0_0_23%]"
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
