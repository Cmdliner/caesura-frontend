import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, ChevronDown, PenLine, ShieldCheck, Sparkles, type LucideIcon } from "lucide-react";
import Header from "@/components/home/header";
import Cta from "@/components/home/cta";
import Footer from "@/components/layout/footer";
import { DotPattern, Splash } from "@/components/ui/patterns";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers to common questions about reading, writing and your account on Caesura.",
};

const groups: { id: string; title: string; icon: LucideIcon; items: { q: string; a: React.ReactNode }[] }[] = [
  {
    id: "getting-started",
    title: "Getting started",
    icon: Sparkles,
    items: [
      { q: "What is Caesura?", a: "Caesura is a place to read stories and to write your own. Browse classics and original fiction, keep a personal library, and publish chapters for other readers." },
      { q: "Is Caesura free?", a: "Yes. Reading is free, and so is creating an account." },
      { q: "Do I need an account?", a: "You can browse and read without one. A free account lets you save stories to your library, track your reading progress and write your own." },
    ],
  },
  {
    id: "reading",
    title: "Reading",
    icon: BookOpen,
    items: [
      { q: "How do I save a story?", a: "Open any story and add it to your library. It then appears under Reading, Want to read or Finished, depending on where you are in it." },
      { q: "Does Caesura remember where I stopped?", a: "Yes. Your progress is saved to your account, so you can pick up exactly where you left off." },
      { q: "Can I change how the reader looks?", a: "Yes. The reader offers Light, Paper and Dark themes and adjustable text size." },
      {
        q: "Is there a mobile app?",
        a: (
          <>
            It’s on the way. Until it reaches the App Store and Google Play, you can add Caesura to your home screen; see the{" "}
            <Link href="/download" className="font-semibold text-brand-700 hover:text-brand-800">app page</Link> for how.
          </>
        ),
      },
    ],
  },
  {
    id: "writing",
    title: "Writing",
    icon: PenLine,
    items: [
      { q: "How do I publish a story?", a: "Choose Write, create a story with a title, cover and genre, then add chapters in the editor. You decide when it's ready to share." },
      { q: "Who owns what I write?", a: "You do. Caesura only has the permission it needs to show your work to readers. The Terms of Service explain the details." },
      { q: "Can I add formatting like italics?", a: "Yes. The editor supports headings, bold, italics, quotes and more." },
    ],
  },
  {
    id: "account",
    title: "Account & privacy",
    icon: ShieldCheck,
    items: [
      {
        q: "I forgot my password. What now?",
        a: (
          <>
            Use <Link href="/forgot-password" className="font-semibold text-brand-700 hover:text-brand-800">Forgot password</Link> on the login page and we’ll email you a reset link. It’s valid for one hour and works once.
          </>
        ),
      },
      {
        q: "What do you do with my data?",
        a: (
          <>
            We collect only what’s needed to run your account and we don’t sell it. Read the{" "}
            <Link href="/privacy" className="font-semibold text-brand-700 hover:text-brand-800">Privacy Policy</Link> for the details.
          </>
        ),
      },
      {
        q: "How do I delete my account?",
        a: (
          <>
            <Link href="/contact" className="font-semibold text-brand-700 hover:text-brand-800">Contact us</Link> and we’ll remove your account and personal data.
          </>
        ),
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <>
      <Header solid />
      <main>
        <section className="relative overflow-hidden bg-white pb-14 pt-28 md:pb-16 md:pt-36">
          <Splash variant="a" className="-right-32 -top-40 h-[28rem] w-[28rem] text-brand-100" />
          <Splash variant="c" className="right-[30%] top-28 hidden h-24 w-24 text-brand-200 lg:block" />
          <DotPattern className="bottom-0 left-0 hidden h-48 w-80 text-zinc-300/70 [mask-image:linear-gradient(to_top_right,black,transparent)] md:block" />
          <div className="container-page relative">
            <p className="eyebrow mb-3">Help centre</p>
            <h1 className="font-brand text-5xl font-black leading-[1.05] text-zinc-950 md:text-7xl">
              Questions, <span className="text-brand-600">answered</span>
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-zinc-600">
              Everything you need to know about reading, writing and your account. Can’t find it? We’re one message away.
            </p>
            <nav aria-label="Topics" className="mt-8 flex flex-wrap gap-2">
              {groups.map(({ id, title, icon: Icon }) => (
                <a key={id} href={`#${id}`} className="chip gap-2">
                  <Icon className="h-4 w-4" />
                  {title}
                </a>
              ))}
            </nav>
          </div>
        </section>

        <section className="bg-zinc-50 py-14 md:py-20">
          <div className="container-page max-w-4xl space-y-12">
            {groups.map(({ id, title, icon: Icon, items }) => (
              <div key={id} id={id} className="scroll-mt-24">
                <h2 className="mb-5 flex items-center gap-3 text-2xl font-bold tracking-tight text-zinc-950">
                  <span className="icon-tile !h-10 !w-10">
                    <Icon className="h-5 w-5" />
                  </span>
                  {title}
                </h2>
                <div className="space-y-3">
                  {items.map(({ q, a }) => (
                    <details key={q} className="card group px-6 py-5 open:border-zinc-300">
                      <summary className="flex list-none items-center justify-between gap-4 font-semibold text-zinc-950 [&::-webkit-details-marker]:hidden">
                        {q}
                        <ChevronDown className="h-5 w-5 flex-shrink-0 text-zinc-400 transition-transform duration-200 group-open:rotate-180" />
                      </summary>
                      <p className="mt-3 text-[15px] leading-relaxed text-zinc-600">{a}</p>
                    </details>
                  ))}
                </div>
              </div>
            ))}

            <div className="card flex flex-col items-start justify-between gap-4 p-7 sm:flex-row sm:items-center">
              <div>
                <p className="font-semibold text-zinc-950">Still have a question?</p>
                <p className="mt-1 text-sm text-zinc-600">Tell us what you’re stuck on and we’ll help.</p>
              </div>
              <Link href="/contact" className="btn btn-dark btn-md">
                Contact us
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        <Cta />
      </main>
      <Footer />
    </>
  );
}
