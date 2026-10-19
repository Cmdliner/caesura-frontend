import { Bookmark, ChartColumn, Compass, MessagesSquare, MonitorSmartphone, PenLine, type LucideIcon } from "lucide-react";
import SectionHeading from "@/components/ui/section-heading";
import { DotPattern, Splash } from "@/components/ui/patterns";

const small: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: PenLine,
    title: "Creator Publishing",
    description: "Publish chapters in minutes, schedule releases, and keep your readership engaged consistently.",
  },
  {
    icon: Bookmark,
    title: "Reader Retention",
    description: "Bookmarks, progress sync, and notifications help readers stay invested from first chapter to finale.",
  },
  {
    icon: MessagesSquare,
    title: "Community Signals",
    description: "Comments, reactions, and review threads give writers and readers a meaningful feedback loop.",
  },
  {
    icon: MonitorSmartphone,
    title: "Cross-Device Reading",
    description: "A clean, responsive interface on desktop and mobile, tuned for long-form reading comfort.",
  },
];

const bars = [38, 52, 44, 68, 60, 82, 96];

export default function Features() {
  return (
    <section className="section bg-white">
      <Splash variant="c" className="-left-10 top-16 hidden h-40 w-40 text-brand-100 lg:block" />
      <DotPattern className="right-0 top-0 hidden h-56 w-80 text-zinc-300/70 [mask-image:linear-gradient(to_bottom_left,black,transparent)] lg:block" />

      <div className="container-page relative">
        <SectionHeading
          align="left"
          eyebrow="Platform"
          title="Built for readers and storytellers"
          description="One focused place to get stories discovered, grow a community, and keep creators moving."
          className="mb-14"
        />

        <div className="grid gap-5 lg:grid-cols-4">
          {/* Lead feature: photo tile */}
          <article className="group relative flex min-h-[26rem] flex-col justify-end overflow-hidden rounded-3xl bg-zinc-950 lg:col-span-2 lg:row-span-2">
            <img
              src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1200&q=70"
              alt=""
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-zinc-950/10" />
            <div className="relative p-7 md:p-9">
              <span className="icon-tile mb-5 !bg-brand-600 !text-white">
                <Compass className="h-5 w-5" />
              </span>
              <h3 className="text-2xl font-bold text-white md:text-3xl">Editorial Discovery</h3>
              <p className="mt-3 max-w-md leading-relaxed text-zinc-300">
                Curated shelves, genre spotlights and tailored recommendations surface high-quality reads, so the right
                story finds the right reader.
              </p>
              <p className="mt-6 inline-flex items-center gap-3 rounded-full bg-white/10 py-1.5 pl-2 pr-4 text-sm text-white ring-1 ring-white/20">
                <span className="rounded-full bg-brand-600 px-2.5 py-0.5 text-xs font-bold">87%</span>
                of readers find their next title through curated rails
              </p>
            </div>
          </article>

          {small.map(({ icon: Icon, title, description }) => (
            <article key={title} className="card card-interactive p-6 lg:col-span-1">
              <span className="icon-tile mb-5">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mb-2 text-lg font-semibold text-zinc-950">{title}</h3>
              <p className="text-[15px] leading-relaxed text-zinc-600">{description}</p>
            </article>
          ))}

          {/* Wide analytics tile */}
          <article className="relative overflow-hidden rounded-3xl bg-brand-600 p-7 text-white md:p-9 lg:col-span-4">
            <Splash variant="a" className="-right-16 -top-28 h-80 w-80 text-brand-500" />
            <Splash variant="c" className="bottom-2 left-[40%] hidden h-24 w-24 text-brand-500 md:block" />
            <div className="relative grid items-center gap-8 md:grid-cols-[1.2fr_1fr]">
              <div>
                <span className="icon-tile mb-5 !bg-white !text-brand-700">
                  <ChartColumn className="h-5 w-5" />
                </span>
                <h3 className="text-2xl font-bold md:text-3xl">Growth Analytics</h3>
                <p className="mt-3 max-w-lg leading-relaxed text-white/85">
                  Track reads, completion rate and engagement trends to understand exactly what resonates with your
                  audience, chapter by chapter.
                </p>
              </div>
              <div aria-hidden="true" className="flex h-32 items-end gap-2.5 md:justify-end">
                {bars.map((h, i) => (
                  <span
                    key={i}
                    className="w-7 rounded-t-lg bg-white/90 first:bg-white/50 even:bg-white/70 md:w-9"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
