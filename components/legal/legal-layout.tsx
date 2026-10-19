import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Header from "@/components/home/header";
import Footer from "@/components/layout/footer";
import { DotPattern, Splash } from "@/components/ui/patterns";
import { site } from "@/lib/site";

export interface LegalSection {
  id: string;
  title: string;
  body: ReactNode;
}

interface LegalLayoutProps {
  eyebrow: string;
  title: string;
  summary: string;
  sections: LegalSection[];
}

/** Shared shell for Privacy Policy and Terms of Service: hero, sticky contents, numbered sections. */
export default function LegalLayout({ eyebrow, title, summary, sections }: LegalLayoutProps) {
  return (
    <>
      <Header solid />
      <main>
        <section className="relative overflow-hidden bg-white pb-14 pt-28 md:pb-16 md:pt-36">
          <Splash variant="a" className="-right-32 -top-40 h-[28rem] w-[28rem] text-brand-100" />
          <DotPattern className="bottom-0 left-0 hidden h-48 w-80 text-zinc-300/70 [mask-image:linear-gradient(to_top_right,black,transparent)] md:block" />
          <div className="container-page relative">
            <p className="eyebrow mb-3">{eyebrow}</p>
            <h1 className="font-brand text-5xl font-black leading-[1.05] text-zinc-950 md:text-6xl">{title}</h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-zinc-600">{summary}</p>
            <p className="mt-6">
              <span className="badge badge-neutral">Last updated {site.lastUpdated}</span>
            </p>
          </div>
        </section>

        <section className="bg-zinc-50 py-14 md:py-20">
          <div className="container-page grid grid-cols-1 items-start gap-10 lg:grid-cols-[16rem_1fr] lg:gap-14">
            <nav aria-label="On this page" className="card p-5 lg:sticky lg:top-24">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-500">On this page</p>
              <ol className="space-y-1">
                {sections.map((s, i) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="flex gap-3 rounded-lg px-2 py-1.5 text-sm text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-zinc-950"
                    >
                      <span className="w-5 flex-shrink-0 font-semibold text-brand-700">{i + 1}</span>
                      {s.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            <div className="space-y-5">
              {sections.map((s, i) => (
                <article key={s.id} id={s.id} className="card scroll-mt-24 p-7 md:p-9">
                  <h2 className="flex items-baseline gap-4 text-xl font-bold tracking-tight text-zinc-950 md:text-2xl">
                    <span className="font-brand text-3xl font-black text-brand-600">{String(i + 1).padStart(2, "0")}</span>
                    {s.title}
                  </h2>
                  <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-zinc-600 [&_li]:pl-1 [&_strong]:font-semibold [&_strong]:text-zinc-900 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5 [&_ul]:marker:text-brand-600">
                    {s.body}
                  </div>
                </article>
              ))}

              <div className="card flex flex-col items-start justify-between gap-4 p-7 sm:flex-row sm:items-center">
                <div>
                  <p className="font-semibold text-zinc-950">Questions about this page?</p>
                  <p className="mt-1 text-sm text-zinc-600">We’re happy to explain anything in plain language.</p>
                </div>
                <Link href="/contact" className="btn btn-dark btn-md">
                  Contact us
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
