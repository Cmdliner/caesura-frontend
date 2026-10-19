import Link from "next/link";
import { ArrowRight, BookOpen, Check } from "lucide-react";
import { DotPattern, Splash } from "@/components/ui/patterns";

// Public-domain covers from Project Gutenberg (the same books readers can open on Caesura).
const cover = (id: number) => `https://www.gutenberg.org/cache/epub/${id}/pg${id}.cover.medium.jpg`;

const perks = ["Free to join", "No credit card", "Read on any device"];

export default function Cta() {
  return (
    <section className="section bg-white">
      <Splash variant="a" className="-right-28 top-1/2 h-[34rem] w-[34rem] -translate-y-1/2 text-brand-100" />
      <DotPattern className="bottom-0 left-0 hidden h-48 w-80 text-zinc-300/70 [mask-image:linear-gradient(to_top_right,black,transparent)] md:block" />

      <div className="container-page relative grid grid-cols-1 items-center gap-16 lg:grid-cols-[1.05fr_1fr]">
        {/* Copy */}
        <div>
          <p className="eyebrow mb-4">Get started free</p>
          <h2 className="font-brand text-5xl font-black leading-[1.05] text-zinc-950 md:text-6xl">
            Ready to start your <span className="text-brand-600">journey?</span>
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-600">
            Join millions of readers and writers discovering stories that move them. Your next favourite read, or your
            breakthrough as a writer, is one tap away.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/discover" className="btn btn-primary btn-lg">
              Start Reading Now
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/create-story" className="btn btn-dark btn-lg">
              Start Writing
            </Link>
          </div>

          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-600">
            {perks.map((p) => (
              <li key={p} className="inline-flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                  <Check className="h-3 w-3" strokeWidth={3} />
                </span>
                {p}
              </li>
            ))}
          </ul>
        </div>

        {/* Cover fan with floating chips */}
        <div className="relative mx-auto h-[24rem] w-full max-w-md sm:h-[27rem]" aria-hidden="true">
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-center">
            {[
              { id: 1342, cls: "-rotate-[8deg] translate-y-2" },
              { id: 84, cls: "z-10 -translate-y-5" },
              { id: 345, cls: "rotate-[8deg] translate-y-2" },
            ].map((c) => (
              <img
                key={c.id}
                src={cover(c.id)}
                alt=""
                loading="lazy"
                className={`-ml-12 aspect-[2/3] w-36 rounded-xl object-cover shadow-[0_18px_40px_rgba(0,0,0,0.25)] ring-1 ring-black/10 first:ml-0 sm:w-44 ${c.cls}`}
              />
            ))}
          </div>

          <div className="absolute left-0 top-2 z-20 flex items-center gap-3 rounded-2xl bg-white p-2.5 pr-4 shadow-pop ring-1 ring-black/5 sm:-left-4">
            <img src={cover(11)} alt="" loading="lazy" className="h-12 w-8 rounded-md object-cover" />
            <div>
              <p className="text-xs font-bold text-zinc-950">Continue reading</p>
              <div className="mt-1.5 h-1.5 w-24 overflow-hidden rounded-full bg-zinc-100">
                <div className="h-full w-2/3 rounded-full bg-brand-600" />
              </div>
              <p className="mt-1 text-[10px] font-medium text-zinc-500">64% read</p>
            </div>
          </div>

          <div className="absolute bottom-16 right-0 z-20 flex items-center gap-2 rounded-full bg-zinc-950 py-2 pl-3 pr-4 text-white shadow-pop sm:-right-2">
            <BookOpen className="h-4 w-4 text-brand-400" />
            <span className="text-xs font-semibold">Classics, free to read</span>
          </div>
        </div>
      </div>
    </section>
  );
}
