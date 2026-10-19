import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Bell, BookMarked, ChevronDown, EllipsisVertical, RefreshCcw, Share, Smartphone, SquarePlus, type LucideIcon } from "lucide-react";
import Header from "@/components/home/header";
import Cta from "@/components/home/cta";
import Footer from "@/components/layout/footer";
import SectionHeading from "@/components/ui/section-heading";
import StoreBadge from "@/components/ui/store-badge";
import { LibraryScreen, Phone, ReaderScreen } from "@/components/ui/phone-mockup";
import { DotPattern, Splash } from "@/components/ui/patterns";
import { appIsLive, appLinks } from "@/lib/app-links";

export const metadata: Metadata = {
  title: "Get the app",
  description: "Take Caesura with you. Download the app for iPhone and Android, or add Caesura to your home screen today.",
};

const features: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: RefreshCcw,
    title: "Pick up exactly where you left off",
    description: "Your reading progress follows your account, so you can start a chapter on your laptop and finish it on the train.",
  },
  {
    icon: BookMarked,
    title: "Your whole library, in your pocket",
    description: "Everything you've saved is there the moment you sign in: reading, want to read, and finished.",
  },
  {
    icon: Bell,
    title: "Never miss a new chapter",
    description: "Follow the stories you love and hear about it when the next chapter lands.",
  },
];

const steps = {
  ios: {
    title: "iPhone & iPad",
    where: "Safari",
    steps: [
      { icon: Share, text: "Open Caesura in Safari and tap the Share button." },
      { icon: SquarePlus, text: "Choose “Add to Home Screen”." },
      { icon: Smartphone, text: "Tap Add. Caesura now opens like an app." },
    ],
  },
  android: {
    title: "Android",
    where: "Chrome",
    steps: [
      { icon: EllipsisVertical, text: "Open Caesura in Chrome and tap the ⋮ menu." },
      { icon: SquarePlus, text: "Choose “Add to Home screen” (or “Install app”)." },
      { icon: Smartphone, text: "Confirm. Caesura now opens like an app." },
    ],
  },
};

const faqs = [
  {
    q: "Is the Caesura app free?",
    a: "Yes. Reading on Caesura is free, on the web or in the app, and one account works everywhere.",
  },
  {
    q: appIsLive ? "Which devices are supported?" : "When will the app be available?",
    a: appIsLive
      ? "iPhone and iPad, plus Android phones and tablets."
      : "We're putting the finishing touches on it. Until it lands in the App Store and Google Play, you can add Caesura to your home screen and use it like an app.",
  },
  {
    q: "Will my library and reading progress sync?",
    a: "Yes. They're tied to your Caesura account, so everything you do on the web shows up on your phone, and the other way round.",
  },
  {
    q: "Do I need an account?",
    a: "You can browse without one. Create a free account to save stories, track progress and write your own.",
  },
];

export default function DownloadPage() {
  return (
    <>
      <Header solid />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-white pb-20 pt-28 md:pb-28 md:pt-36">
          <Splash variant="a" className="-left-40 -top-40 h-[30rem] w-[30rem] text-brand-100" />
          <Splash variant="c" className="left-[46%] top-24 hidden h-24 w-24 text-brand-200 lg:block" />
          <DotPattern className="bottom-0 left-0 hidden h-56 w-96 text-zinc-300/70 [mask-image:linear-gradient(to_top_right,black,transparent)] lg:block" />

          <div className="container-page relative grid grid-cols-1 items-center gap-16 lg:grid-cols-[1.05fr_1fr]">
            <div>
              {!appIsLive && (
                <span className="badge badge-brand mb-6">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-600" />
                  Coming soon to the App Store and Google Play
                </span>
              )}
              <p className="eyebrow mb-3">Mobile app</p>
              <h1 className="font-brand text-5xl font-black leading-[1.05] text-zinc-950 md:text-7xl">
                Take every story <span className="text-brand-600">with you</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-600">
                Read, save and pick up where you left off on iPhone and Android. Same account, same library, in your pocket.
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-4">
                <StoreBadge platform="ios" href={appLinks.ios} />
                <StoreBadge platform="android" href={appLinks.android} />
              </div>
              <p className="mt-5 text-sm text-zinc-500">Free to download · iPhone, iPad and Android</p>

              <Link href="/discover" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-brand-700 transition-colors hover:text-brand-800">
                Prefer the browser? Start reading now
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Phones */}
            <div className="relative mx-auto flex h-[34rem] w-full max-w-md items-center justify-center lg:max-w-none">
              <Splash variant="b" className="left-1/2 top-1/2 h-[26rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 text-brand-100" />
              <Phone className="absolute left-[2%] top-10 -rotate-6 sm:left-[8%]">
                <LibraryScreen />
              </Phone>
              <Phone className="absolute right-[2%] top-0 rotate-3 sm:right-[8%]">
                <ReaderScreen />
              </Phone>
            </div>
          </div>
        </section>

        {/* Why */}
        <section className="section bg-zinc-50">
          <div className="container-page relative">
            <SectionHeading eyebrow="Why the app" title="Made for reading on the go" description="Everything you love about Caesura, built for your thumb." className="mb-14" />
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {features.map(({ icon: Icon, title, description }) => (
                <article key={title} className="card card-interactive p-7">
                  <span className="icon-tile mb-5">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mb-2 text-lg font-semibold text-zinc-950">{title}</h3>
                  <p className="text-[15px] leading-relaxed text-zinc-600">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Add to home screen */}
        <section className="section bg-white">
          <Splash variant="a" className="-right-40 -top-40 h-[26rem] w-[26rem] text-brand-100" />
          <div className="container-page relative">
            <SectionHeading
              eyebrow="Use it today"
              title="Add Caesura to your home screen"
              description="No waiting for the stores: it takes about ten seconds and gives you an app-style icon on your phone."
              className="mb-14"
            />
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {Object.values(steps).map((platform) => (
                <article key={platform.title} className="card p-7">
                  <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-zinc-950">{platform.title}</h3>
                    <span className="badge badge-neutral">in {platform.where}</span>
                  </div>
                  <ol className="space-y-5">
                    {platform.steps.map(({ icon: Icon, text }, i) => (
                      <li key={text} className="flex items-start gap-4">
                        <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-zinc-950 text-sm font-bold text-white">{i + 1}</span>
                        <p className="flex-1 pt-1.5 text-[15px] leading-relaxed text-zinc-700">{text}</p>
                        <Icon className="mt-2 h-5 w-5 flex-shrink-0 text-brand-600" />
                      </li>
                    ))}
                  </ol>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="section bg-zinc-50">
          <div className="container-page relative max-w-3xl">
            <SectionHeading eyebrow="Questions" title="Good to know" className="mb-12" />
            <div className="space-y-3">
              {faqs.map(({ q, a }) => (
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
        </section>

        <Cta />
      </main>
      <Footer />
    </>
  );
}
