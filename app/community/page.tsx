import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Feather,
  Flame,
  Lightbulb,
  Megaphone,
  MessageCircle,
  MessagesSquare,
  PenLine,
  Pin,
  Sparkles,
  Swords,
  type LucideIcon,
} from "lucide-react";
import Header from "@/components/home/header";
import Cta from "@/components/home/cta";
import Footer from "@/components/layout/footer";
import SectionHeading from "@/components/ui/section-heading";
import { DotPattern, Splash } from "@/components/ui/patterns";
import { CommunityHero, DarkSteps, FeatureGrid } from "@/components/community/blocks";

export const metadata: Metadata = {
  title: "Forums",
  description: "Talk craft, swap feedback and share what you're reading with the Caesura community.",
};

const threads: { icon: LucideIcon; category: string; title: string; replies: number; pinned?: boolean }[] = [
  { icon: Pin, category: "Announcements", title: "Welcome to Caesura: start here", replies: 24, pinned: true },
  { icon: PenLine, category: "Writing craft", title: "How do you keep a long story from sagging in the middle?", replies: 48 },
  { icon: BookOpen, category: "Book talk", title: "Which classic surprised you most?", replies: 31 },
  { icon: Feather, category: "Poetry", title: "Share a line you wrote this week", replies: 17 },
];

const categories: { icon: LucideIcon; name: string; blurb: string }[] = [
  { icon: Megaphone, name: "Announcements", blurb: "News and updates from the Caesura team." },
  { icon: PenLine, name: "Writing craft", blurb: "Plot, voice, pacing and the habits behind them." },
  { icon: Lightbulb, name: "Feedback swaps", blurb: "Trade honest, kind critiques on your chapters." },
  { icon: BookOpen, name: "Book talk", blurb: "What you're reading, loving and arguing about." },
  { icon: Swords, name: "Fantasy & sci-fi", blurb: "Worlds, magic systems and where they break." },
  { icon: Feather, name: "Poetry corner", blurb: "Verse, form and the pause between lines." },
];

const features = [
  {
    icon: MessagesSquare,
    title: "Conversations that stay on topic",
    description: "Focused categories and threaded replies keep discussions easy to follow and easy to find later.",
  },
  {
    icon: Sparkles,
    title: "Feedback that helps",
    description: "Share a chapter, get thoughtful notes. Clear guidelines keep critique specific, kind and useful.",
  },
  {
    icon: Flame,
    title: "A welcoming place for everyone",
    description: "Moderated by people who care about the community, so newcomers and veterans both feel at home.",
  },
];

const steps = [
  { title: "Pick a category", description: "Browse the boards or search for a topic you care about." },
  { title: "Join the conversation", description: "Reply, ask a question or start a thread of your own." },
  { title: "Grow as a reader and writer", description: "Take what you learn back to your library and your drafts." },
];

export default function CommunityPage() {
  return (
    <>
      <Header solid />
      <main>
        <CommunityHero
          current="/community"
          eyebrow="Forums"
          title={
            <>
              Where readers and writers <span className="text-brand-600">talk shop</span>
            </>
          }
          description="Ask questions, trade feedback and share book recommendations. The forums are the front porch of Caesura."
          actions={
            <>
              <Link href="/discover" className="btn btn-primary btn-lg">
                Start reading
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/clubs" className="btn btn-outline btn-lg">
                Explore reading clubs
              </Link>
            </>
          }
        >
          {/* Forum preview */}
          <div className="card overflow-hidden shadow-pop">
            <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4">
              <p className="flex items-center gap-2 text-sm font-bold text-zinc-950">
                <MessagesSquare className="h-4 w-4 text-brand-600" />
                Latest threads
              </p>
              <span className="badge badge-neutral">Preview</span>
            </div>
            <ul className="divide-y divide-zinc-100">
              {threads.map(({ icon: Icon, category, title, replies, pinned }) => (
                <li key={title} className="flex items-start gap-4 px-5 py-4">
                  <span className="icon-tile !h-10 !w-10 flex-shrink-0">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-brand-700">
                      {category}
                      {pinned && <span className="ml-2 text-zinc-500">Pinned</span>}
                    </p>
                    <p className="mt-0.5 truncate text-sm font-semibold text-zinc-950">{title}</p>
                  </div>
                  <span className="flex flex-shrink-0 items-center gap-1.5 text-xs font-medium text-zinc-500">
                    <MessageCircle className="h-3.5 w-3.5" />
                    {replies}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </CommunityHero>

        {/* Why */}
        <section className="section bg-zinc-50">
          <div className="container-page relative">
            <SectionHeading
              eyebrow="Why forums"
              title="Better stories start with better conversations"
              description="A calm, well-kept space for the questions you can't ask a search engine."
              className="mb-14"
            />
            <FeatureGrid features={features} />
          </div>
        </section>

        {/* Categories */}
        <section className="section bg-white">
          <Splash variant="a" className="-right-40 -top-40 h-[26rem] w-[26rem] text-brand-100" />
          <DotPattern className="bottom-0 left-0 hidden h-48 w-80 text-zinc-300/70 [mask-image:linear-gradient(to_top_right,black,transparent)] md:block" />
          <div className="container-page relative">
            <SectionHeading
              eyebrow="Boards"
              title="Find your corner"
              description="Six boards to start with, and more as the community grows."
              className="mb-14"
            />
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map(({ icon: Icon, name, blurb }) => (
                <article key={name} className="card card-interactive flex items-start gap-4 p-6">
                  <span className="icon-tile flex-shrink-0">
                    <Icon className="h-5 w-5" />
                  </span>
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
              title="Three steps to join in"
              description="No new account needed, just your Caesura login."
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
