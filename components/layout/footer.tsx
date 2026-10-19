import Link from "next/link";
import Logo from "@/components/ui/logo";
import { DotPattern, Splash } from "@/components/ui/patterns";
import AuthorCredit from "@/components/layout/author-credit";
import BackToTop from "@/components/layout/back-to-top";
import StoreBadge from "@/components/ui/store-badge";
import { appLinks } from "@/lib/app-links";

const columns = [
  {
    title: "Discover",
    links: [
      { label: "All Stories", href: "/discover" },
      { label: "Genres", href: "/genres" },
      { label: "Trending", href: "/trending" },
      { label: "New Releases", href: "/new" },
      { label: "Get the app", href: "/download" },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "Start Writing", href: "/write" },
      { label: "Forums", href: "/community" },
      { label: "Contests", href: "/contests" },
      { label: "Reading Clubs", href: "/clubs" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Contact Us", href: "/contact" },
      { label: "FAQ", href: "/faq" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
];

const socials = [
  {
    label: "X",
    href: "#",
    icon: (
      <path
        fill="currentColor"
        d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
      />
    ),
  },
  {
    label: "Instagram",
    href: "#",
    icon: (
      <>
        <rect x="3.5" y="3.5" width="17" height="17" rx="5" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
      </>
    ),
  },
  {
    label: "Facebook",
    href: "#",
    icon: (
      <path
        fill="currentColor"
        d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.3-1.5 1.6-1.5h1.6V3.6c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.4H7.8V13h2.7v8z"
      />
    ),
  },
  {
    label: "Discord",
    href: "#",
    icon: (
      <path
        d="M5 5h14v10h-8l-4 4v-4H5V5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    ),
  },
];

export default function Footer() {
  return (
    // The outer wrapper is transparent and inset, so the dark card floats with rounded corners
    // on every side instead of being a full-bleed rectangle.
    <footer className="px-3 pb-3 pt-4 sm:px-5 sm:pb-5">
      <div className="relative overflow-hidden rounded-[2rem] bg-zinc-950 text-zinc-400 sm:rounded-[2.5rem]">
        <Splash variant="a" className="-right-28 -top-36 h-[26rem] w-[26rem] text-brand-600/10" />
        <Splash variant="c" className="-bottom-6 left-[38%] hidden h-32 w-32 text-brand-600/10 lg:block" />
        <DotPattern className="inset-x-0 top-0 h-64 text-white/[0.06] [mask-image:linear-gradient(to_bottom,black,transparent)]" />

        <div className="container-page relative pb-8 pt-14 md:pt-16">
          <div className="grid gap-12 lg:grid-cols-[1.25fr_2fr] lg:gap-16">
            {/* Brand + app */}
            <div className="max-w-sm">
              <Logo size="lg" tone="light" />
              <p className="mt-5 text-sm leading-relaxed">
                Where stories come alive and voices are heard. Read original fiction, publish your own, and build a
                community around the stories you love.
              </p>

              <p className="mb-3 mt-8 text-xs font-semibold uppercase tracking-widest text-zinc-500">Get the app</p>
              <div className="flex flex-wrap gap-3">
                <StoreBadge platform="ios" href={appLinks.ios} tone="light" className="!min-w-0 !px-4 !py-2.5" />
                <StoreBadge platform="android" href={appLinks.android} tone="light" className="!min-w-0 !px-4 !py-2.5" />
              </div>

              <div className="mt-8 flex gap-2">
                {socials.map((s) => (
                  <Link
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-zinc-300 transition-colors hover:border-white/40 hover:bg-white/5 hover:text-white"
                  >
                    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" aria-hidden="true">
                      {s.icon}
                    </svg>
                  </Link>
                ))}
              </div>
            </div>

            {/* Link columns */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3">
              {columns.map((col) => (
                <nav key={col.title} aria-label={col.title}>
                  <h4 className="mb-5 text-xs font-semibold uppercase tracking-widest text-zinc-500">{col.title}</h4>
                  <ul className="space-y-3.5 text-sm">
                    {col.links.map((link) => (
                      <li key={link.label}>
                        <Link href={link.href} className="text-zinc-300 transition-colors hover:text-white">
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              ))}
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-14 grid items-center gap-5 border-t border-white/10 pt-6 text-sm text-zinc-500 md:grid-cols-[1fr_auto_1fr]">
            <p className="text-center md:text-left">© 2026 Caesura. All rights reserved.</p>
            <AuthorCredit />
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 md:justify-end">
              <Link href="/privacy" className="transition-colors hover:text-white">
                Privacy
              </Link>
              <Link href="/terms" className="transition-colors hover:text-white">
                Terms
              </Link>
              <BackToTop />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
