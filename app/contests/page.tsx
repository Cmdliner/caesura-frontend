import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Award, CalendarDays, Check, PenLine, ScrollText, Trophy, Vote, type LucideIcon } from "lucide-react";
import Header from "@/components/home/header";
import Cta from "@/components/home/cta";
import Footer from "@/components/layout/footer";
import SectionHeading from "@/components/ui/section-heading";
import { DotPattern, Splash } from "@/components/ui/patterns";
import { CommunityHero, DarkSteps, FeatureGrid } from "@/components/community/blocks";

export const metadata: Metadata = {
  title: "Contests",
  description: "Write to a theme, get read by the community and win recognition. Caesura writing contests are opening soon.",
};

const stages: { icon: LucideIcon; label: string; active?: boolean }[] = [
  { icon: ScrollText, label: "Theme", active: true },
  { icon: PenLine, label: "Write" },
  { icon: Vote, label: "Vote" },
  { icon: Trophy, label: "Winners" },
];

const categories = [
  { name: "Short story", blurb: "A complete tale in a few thousand words." },
  { name: "Poetry", blurb: "Verse in any form, from sonnets to free verse." },
  { name: "First chapter", blurb: "Open a story so well readers have to keep going." },
];

const features = [
  {
    icon: ScrollText,
    title: "A fresh theme each round",
    description: "A clear prompt and word limit give you something to aim at, without boxing in your imagination.",
  },
  {
    icon: Vote,
    title: "Chosen by readers",
    description: "The community reads, votes and comments, so your audience is part of the result from day one.",
  },
  {
    icon: Award,
    title: "Recognition that lasts",
    description: "Winners and finalists earn a badge on their profile and a spot in our featured collections.",
  },
];

const steps = [
  { title: "Enter your story", description: "Publish a new piece on Caesura and submit it to the open contest." },
  { title: "Get read", description: "Readers discover entries, leave feedback and vote for their favourites." },
  { title: "Celebrate", description: "Winners are announced and featured across the site." },
];

export default function ContestsPage() {
  return (
    <>
      <Header solid />
      <main>
        <CommunityHero
          current="/contests"
          eyebrow="Contests"
          title={
            <>
              Write to a theme. <span className="text-brand-600">Get read.</span>
            </>
          }
          description="Friendly writing contests judged by the community. Pick a prompt, publish your best work and let readers decide."
          actions={
            <>
              <Link href="/create-story" className="btn btn-primary btn-lg">
                Start writing
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/discover" className="btn btn-outline btn-lg">
                Read what&apos;s new
              </Link>
            </>
          }
        >
          {/* Contest preview */}
          <div className="card overflow-hidden shadow-pop">
            <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4">
              <p className="flex items-center gap-2 text-sm font-bold text-zinc-950">
                <Trophy className="h-4 w-4 text-brand-600" />
                Featured contest
              </p>
              <span className="badge badge-neutral">Preview</span>
            </div>

            <div className="p-6">
              <p className="eyebrow mb-2">Short story</p>
              <p className="font-brand text-3xl font-black leading-tight text-zinc-950">“The last lighthouse keeper”</p>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">Up to 3,000 words. One setting, one secret, no rewrites after the deadline.</p>

              <div className="mt-6 flex items-center">
                {stages.map(({ icon: Icon, label, active }, i) => (
                  <div key={label} className="flex flex-1 items-center last:flex-none">
                    <div className="flex flex-col items-center gap-2">
                      <span
                        className={`flex h-10 w-10 items-center justify-center rounded-full ${
                          active ? "bg-brand-600 text-white" : "bg-zinc-100 text-zinc-500"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className={`text-xs font-semibold ${active ? "text-zinc-950" : "text-zinc-500"}`}>{label}</span>
                    </div>
                    {i < stages.length - 1 && <span className="mx-2 mb-6 h-px flex-1 bg-zinc-200" />}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-zinc-100 bg-zinc-50 px-6 py-4 text-sm">
              <span className="flex items-center gap-2 font-medium text-zinc-700">
                <CalendarDays className="h-4 w-4 text-zinc-500" />
                Dates announced soon
              </span>
              <span className="font-semibold text-brand-700">Free to enter</span>
            </div>
          </div>
        </CommunityHero>

        {/* Why */}
        <section className="section bg-zinc-50">
          <div className="container-page relative">
            <SectionHeading
              eyebrow="Why enter"
              title="A deadline, an audience and a reason to finish"
              description="Contests turn “someday” stories into published ones."
              className="mb-14"
            />
            <FeatureGrid features={features} />
          </div>
        </section>

        {/* Categories */}
        <section className="section bg-white">
          <Splash variant="a" className="-right-40 -top-40 h-[26rem] w-[26rem] text-brand-100" />
          <DotPattern className="bottom-0 left-0 hidden h-48 w-80 text-zinc-300/70 [mask-image:linear-gradient(to_top_right,black,transparent)] md:block" />
          <div className="container-page relative grid grid-cols-1 items-start gap-12 lg:grid-cols-[1fr_1.1fr]">
            <div>
              <p className="eyebrow mb-3">Categories</p>
              <h2 className="text-4xl font-bold tracking-tight text-zinc-950 md:text-5xl">A category for every kind of writer</h2>
              <p className="mt-4 text-lg leading-relaxed text-zinc-600">
                Rotating prompts keep each round fresh, and fair rules keep it friendly.
              </p>
              <ul className="mt-8 space-y-3 text-[15px] text-zinc-700">
                {["Original work only", "One entry per category", "Respectful feedback, always"].map((rule) => (
                  <li key={rule} className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                      <Check className="h-3.5 w-3.5" strokeWidth={3} />
                    </span>
                    {rule}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              {categories.map(({ name, blurb }, i) => (
                <article key={name} className="card card-interactive flex items-center gap-5 p-6">
                  <span className="font-brand text-4xl font-black text-brand-600">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="font-semibold text-zinc-950">{name}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-zinc-600">{blurb}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="section bg-zinc-950">
          <Splash variant="a" className="-right-28 -top-36 h-[26rem] w-[26rem] text-brand-600/10" />
          <div className="container-page relative">
            <SectionHeading
              tone="dark"
              eyebrow="How it works"
              title="From idea to winner"
              description="Three steps, and the community does the rest."
              className="mb-14"
            />
            <DarkSteps steps={steps} />
          </div>
        </section>

        <Cta />
      </main>
      <Footer />
    </>
  );
}
