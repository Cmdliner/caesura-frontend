import type { ReactNode } from "react";
import Link from "next/link";
import { MessagesSquare, Trophy, Users, type LucideIcon } from "lucide-react";
import { DotPattern, Splash } from "@/components/ui/patterns";

const sections = [
  { href: "/community", label: "Forums", icon: MessagesSquare },
  { href: "/clubs", label: "Reading Clubs", icon: Users },
  { href: "/contests", label: "Contests", icon: Trophy },
] as const;

/** Pill switcher shared by the three community pages. */
export function CommunityTabs({ current }: { current: (typeof sections)[number]["href"] }) {
  return (
    <nav aria-label="Community" className="flex flex-wrap gap-2">
      {sections.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          aria-current={href === current ? "page" : undefined}
          className={`chip gap-2 ${href === current ? "chip-active" : ""}`}
        >
          <Icon className="h-4 w-4" />
          {label}
        </Link>
      ))}
    </nav>
  );
}

interface CommunityHeroProps {
  current: (typeof sections)[number]["href"];
  eyebrow: string;
  title: ReactNode;
  description: string;
  actions: ReactNode;
  /** The illustrative preview on the right. */
  children: ReactNode;
}

export function CommunityHero({ current, eyebrow, title, description, actions, children }: CommunityHeroProps) {
  return (
    <section className="relative overflow-hidden bg-white pb-20 pt-28 md:pb-28 md:pt-36">
      <Splash variant="a" className="-left-40 -top-40 h-[30rem] w-[30rem] text-brand-100" />
      <Splash variant="c" className="left-[46%] top-24 hidden h-24 w-24 text-brand-200 lg:block" />
      <DotPattern className="bottom-0 left-0 hidden h-56 w-96 text-zinc-300/70 [mask-image:linear-gradient(to_top_right,black,transparent)] lg:block" />

      <div className="container-page relative grid grid-cols-1 items-center gap-16 lg:grid-cols-[1fr_1.05fr]">
        <div>
          <CommunityTabs current={current} />
          <p className="eyebrow mb-3 mt-10">{eyebrow}</p>
          <h1 className="font-brand text-5xl font-black leading-[1.05] text-zinc-950 md:text-7xl">{title}</h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-600">{description}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">{actions}</div>
          <p className="mt-6 inline-flex items-center gap-2 text-sm text-zinc-500">
            <span className="badge badge-brand">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-600" />
              Opening soon
            </span>
            The preview is illustrative.
          </p>
        </div>

        <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
          <Splash variant="b" className="left-1/2 top-1/2 h-[26rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 text-brand-100" />
          <div className="relative" aria-hidden="true">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}

export interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function FeatureGrid({ features }: { features: Feature[] }) {
  return (
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
  );
}

/** Numbered steps on a dark band. */
export function DarkSteps({ steps }: { steps: { title: string; description: string }[] }) {
  return (
    <ol className="grid grid-cols-1 gap-5 md:grid-cols-3">
      {steps.map((step, i) => (
        <li key={step.title} className="rounded-3xl border border-white/10 bg-white/[0.04] p-7">
          <span className="font-brand text-5xl font-black text-brand-400">{String(i + 1).padStart(2, "0")}</span>
          <h3 className="mb-2 mt-4 text-lg font-semibold text-white">{step.title}</h3>
          <p className="text-[15px] leading-relaxed text-zinc-300">{step.description}</p>
        </li>
      ))}
    </ol>
  );
}
