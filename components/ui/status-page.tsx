import Link from "next/link";
import Logo from "@/components/ui/logo";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { DotPattern, Splash } from "@/components/ui/patterns";

interface StatusPageProps {
  code: string;
  title: string;
  description: string;
  icon: LucideIcon;
  actions: ReactNode;
  footnote?: ReactNode;
}

/** Full-page state (404, 500). Brand splash backdrop, big numeral, clear next steps. */
export default function StatusPage({ code, title, description, icon: Icon, actions, footnote }: StatusPageProps) {
  return (
    <main className="relative flex min-h-[100dvh] flex-col overflow-hidden bg-zinc-50">
      <Splash variant="a" className="-left-32 -top-32 h-[30rem] w-[30rem] text-brand-200" />
      <Splash variant="b" className="-bottom-32 -right-32 h-[24rem] w-[32rem] text-brand-600" />
      <Splash variant="c" className="bottom-24 left-[12%] hidden h-28 w-28 text-brand-300 md:block" />
      <DotPattern className="right-[8%] top-[14%] hidden h-40 w-56 text-zinc-300 md:block" />

      <header className="relative px-6 py-6 md:px-12">
        <Logo />
      </header>

      <div className="relative flex flex-1 items-center justify-center px-6 pb-24">
        <div className="mx-auto max-w-lg text-center">
          <p className="font-brand text-[8rem] font-black leading-none tracking-tight text-brand-600 sm:text-[11rem]">
            {code}
          </p>
          <span className="mx-auto -mt-2 mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-zinc-200 bg-white text-zinc-700">
            <Icon className="h-7 w-7" strokeWidth={1.6} />
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-950">{title}</h1>
          <p className="mx-auto mt-3 max-w-sm text-base leading-relaxed text-zinc-600">{description}</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">{actions}</div>
          {footnote && <div className="mt-6 text-xs text-zinc-500">{footnote}</div>}
        </div>
      </div>
    </main>
  );
}
