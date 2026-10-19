import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Bug, CircleHelp, Mail, MessagesSquare, ShieldCheck, type LucideIcon } from "lucide-react";
import Header from "@/components/home/header";
import Footer from "@/components/layout/footer";
import { DotPattern, Splash } from "@/components/ui/patterns";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact us",
  description: "Get help, report a problem or say hello to the Caesura team.",
};

const topics: { icon: LucideIcon; title: string; description: string; subject: string }[] = [
  { icon: CircleHelp, title: "Help with my account", description: "Sign-in trouble, profile changes or deleting your account.", subject: "Account help" },
  { icon: Bug, title: "Report a problem", description: "Something broken or behaving oddly? Tell us what you saw.", subject: "Bug report" },
  { icon: ShieldCheck, title: "Privacy or content concern", description: "Data requests, or content that breaks the community rules.", subject: "Privacy or content" },
];

export default function ContactPage() {
  const email = site.supportEmail;

  return (
    <>
      <Header solid />
      <main>
        <section className="relative overflow-hidden bg-white pb-14 pt-28 md:pb-16 md:pt-36">
          <Splash variant="a" className="-left-40 -top-40 h-[30rem] w-[30rem] text-brand-100" />
          <Splash variant="c" className="left-[46%] top-24 hidden h-24 w-24 text-brand-200 lg:block" />
          <DotPattern className="bottom-0 right-0 hidden h-56 w-96 text-zinc-300/70 [mask-image:linear-gradient(to_top_left,black,transparent)] lg:block" />
          <div className="container-page relative">
            <p className="eyebrow mb-3">Contact</p>
            <h1 className="font-brand text-5xl font-black leading-[1.05] text-zinc-950 md:text-7xl">
              We’d love to <span className="text-brand-600">hear from you</span>
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-zinc-600">
              Questions, feedback or a story about how you use Caesura. A real person reads every message.
            </p>
          </div>
        </section>

        <section className="bg-zinc-50 py-14 md:py-20">
          <div className="container-page grid grid-cols-1 gap-8 lg:grid-cols-[1.15fr_1fr]">
            {/* Email */}
            <div className="card p-8 md:p-10">
              <span className="icon-tile mb-6">
                <Mail className="h-5 w-5" />
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-zinc-950">Email us</h2>
              <p className="mt-2 max-w-md text-[15px] leading-relaxed text-zinc-600">
                The best way to reach us. Tell us what’s going on and include your Caesura username so we can look into it quickly.
              </p>

              {email ? (
                <a href={`mailto:${email}`} className="btn btn-primary btn-lg mt-7">
                  {email}
                  <ArrowRight className="h-4 w-4" />
                </a>
              ) : (
                <p className="mt-7">
                  <span className="badge badge-brand">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-600" />
                    Support email opening soon
                  </span>
                </p>
              )}

              <div className="mt-9 border-t border-zinc-100 pt-7">
                <p className="mb-4 text-sm font-semibold text-zinc-950">What are you writing about?</p>
                <ul className="space-y-3">
                  {topics.map(({ icon: Icon, title, description, subject }) => (
                    <li key={title}>
                      {email ? (
                        <a
                          href={`mailto:${email}?subject=${encodeURIComponent(subject)}`}
                          className="group flex items-start gap-4 rounded-xl p-2 -m-2 transition-colors hover:bg-zinc-50"
                        >
                          <TopicBody icon={Icon} title={title} description={description} />
                        </a>
                      ) : (
                        <div className="flex items-start gap-4">
                          <TopicBody icon={Icon} title={title} description={description} />
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Quicker routes */}
            <div className="space-y-5">
              <Link href="/faq" className="card card-interactive flex items-start gap-4 p-7">
                <span className="icon-tile flex-shrink-0">
                  <CircleHelp className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-semibold text-zinc-950">Check the FAQ first</h3>
                  <p className="mt-1 text-sm leading-relaxed text-zinc-600">Most questions about reading, writing and accounts are answered there.</p>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700">
                    Browse answers
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>

              <Link href="/community" className="card card-interactive flex items-start gap-4 p-7">
                <span className="icon-tile flex-shrink-0">
                  <MessagesSquare className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-semibold text-zinc-950">Ask the community</h3>
                  <p className="mt-1 text-sm leading-relaxed text-zinc-600">Writing advice and book recommendations are best asked in the forums.</p>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700">
                    Visit the forums
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function TopicBody({ icon: Icon, title, description }: { icon: LucideIcon; title: string; description: string }) {
  return (
    <>
      <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-700">
        <Icon className="h-4 w-4" />
      </span>
      <div>
        <p className="text-sm font-semibold text-zinc-950">{title}</p>
        <p className="mt-0.5 text-sm text-zinc-600">{description}</p>
      </div>
    </>
  );
}
