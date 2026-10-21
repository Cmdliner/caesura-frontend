"use client";

import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import {
  ArrowLeft, ArrowRight, BookOpen, BookX, Bookmark, CalendarDays, ChartColumn, ChevronDown, ChevronLeft, ChevronRight,
  CircleAlert, CircleCheck, Compass, Eye, FileText, Heart, House, Info, LayoutGrid, Library, LinkIcon, List, LogOut,
  Mail, MailCheck, Menu, MessagesSquare, MonitorSmartphone, Pencil, PenLine, Plus, Quote, RefreshCw, Search, Shapes,
  Share2, SquarePen, Star, TriangleAlert, Type, User, Users, X, Globe, type LucideIcon,
} from "lucide-react";
import Logo, { LogoMark } from "@/components/ui/logo";
import Alert from "@/components/ui/alert";
import Modal from "@/components/ui/modal";
import EmptyState, { ErrorState, PageLoader } from "@/components/ui/empty-state";
import SectionHeading from "@/components/ui/section-heading";
import { DotPattern, Splash } from "@/components/ui/patterns";
import WaveDivider from "@/components/ui/wave-divider";
import { PasswordInput } from "@/components/auth/fields";
import StoreBadge from "@/components/ui/store-badge";
import MenuButton from "@/components/layout/menu-button";

/* ───────────────────────── helpers ───────────────────────── */

const sections = [
  ["brand", "Brand"],
  ["color", "Colour"],
  ["type", "Typography"],
  ["buttons", "Buttons"],
  ["nav", "Navigation"],
  ["forms", "Forms & feedback"],
  ["surfaces", "Surfaces"],
  ["patterns", "Patterns"],
  ["states", "States"],
  ["icons", "Icons"],
  ["shape", "Radius & shadow"],
  ["rules", "Rules"],
] as const;

function Section({ id, title, intro, children }: { id: string; title: string; intro?: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-zinc-200 py-14">
      <h2 className="text-3xl font-extrabold tracking-tight text-zinc-950">{title}</h2>
      {intro && <p className="mt-2 max-w-2xl text-zinc-600">{intro}</p>}
      <div className="mt-8">{children}</div>
    </section>
  );
}

function Sub({ children }: { children: ReactNode }) {
  return <h3 className="mb-3 mt-8 text-xs font-bold uppercase tracking-widest text-zinc-500 first:mt-0">{children}</h3>;
}

function Code({ children }: { children: ReactNode }) {
  return <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[12px] text-zinc-800">{children}</code>;
}

function Swatch({ name, hex, token, text }: { name: string; hex: string; token?: string; text?: string }) {
  return (
    <div>
      <div className="flex h-16 items-end rounded-xl border border-black/5 p-2" style={{ background: hex }}>
        {text && <span className="text-[11px] font-semibold" style={{ color: text }}>Aa</span>}
      </div>
      <p className="mt-1.5 text-xs font-semibold text-zinc-900">{name}</p>
      <p className="font-mono text-[11px] text-zinc-500">{hex}</p>
      {token && <p className="font-mono text-[11px] text-zinc-400">{token}</p>}
    </div>
  );
}

const brand = [
  ["50", "#fff7ed"], ["100", "#ffedd4"], ["200", "#ffd6a7"], ["300", "#ffb86a"], ["400", "#ff8904"],
  ["500", "#ff6900"], ["600", "#f54900"], ["700", "#ca3500"],
] as const;
const ink = [
  ["50", "#fafafa"], ["100", "#f4f4f5"], ["200", "#e4e4e7"], ["300", "#d4d4d8"], ["400", "#9f9fa9"],
  ["500", "#71717b"], ["600", "#52525c"], ["700", "#3f3f46"], ["900", "#18181b"], ["950", "#09090b"],
] as const;

const iconSet: [string, LucideIcon][] = [
  ["Compass", Compass], ["Shapes", Shapes], ["BookOpen", BookOpen], ["Library", Library], ["PenLine", PenLine],
  ["SquarePen", SquarePen], ["Pencil", Pencil], ["Plus", Plus], ["Search", Search], ["Menu", Menu], ["X", X],
  ["User", User], ["Users", Users], ["LogOut", LogOut], ["Mail", Mail], ["MailCheck", MailCheck], ["Globe", Globe],
  ["Share2", Share2], ["Eye", Eye], ["FileText", FileText], ["Type", Type], ["CalendarDays", CalendarDays],
  ["Bookmark", Bookmark], ["Heart", Heart], ["Star", Star], ["Quote", Quote], ["MessagesSquare", MessagesSquare],
  ["MonitorSmartphone", MonitorSmartphone], ["ChartColumn", ChartColumn], ["LayoutGrid", LayoutGrid], ["List", List],
  ["ArrowLeft", ArrowLeft], ["ArrowRight", ArrowRight], ["ChevronLeft", ChevronLeft], ["ChevronRight", ChevronRight],
  ["ChevronDown", ChevronDown], ["House", House], ["RefreshCw", RefreshCw], ["LinkIcon", LinkIcon], ["Info", Info],
  ["CircleCheck", CircleCheck], ["CircleAlert", CircleAlert], ["TriangleAlert", TriangleAlert], ["BookX", BookX],
];

/* ───────────────────────── page ───────────────────────── */

export default function DesignSystemPage() {
  const [chip, setChip] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="relative overflow-hidden border-b border-zinc-200 bg-white">
        <Splash variant="a" className="-right-24 -top-40 h-[28rem] w-[28rem] text-brand-100" />
        <DotPattern className="inset-y-0 left-0 hidden w-80 text-zinc-300/60 [mask-image:linear-gradient(to_right,black,transparent)] md:block" />
        <div className="container-page relative py-12">
          <Logo href="/" size="lg" />
          <p className="eyebrow mt-8">Design system</p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-zinc-950 sm:text-5xl">Caesura, in components</h1>
          <p className="mt-3 max-w-2xl text-lg text-zinc-600">
            Everything on this page is rendered from the real classes and components used across the app. If it isn&apos;t here, it
            shouldn&apos;t be invented. Written rules live in <Code>DESIGN_SYSTEM.md</Code>.
          </p>
        </div>
      </header>

      {/* Sticky section nav */}
      <nav aria-label="Design system sections" className="sticky top-0 z-40 border-b border-zinc-200 bg-white/90 backdrop-blur-xl">
        <div className="container-page flex gap-1 overflow-x-auto py-2 scrollbar-hide">
          {sections.map(([id, label]) => (
            <a key={id} href={`#${id}`} className="flex-shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-950">
              {label}
            </a>
          ))}
        </div>
      </nav>

      <div className="container-page pb-24">
        {/* ───────── Brand ───────── */}
        <Section id="brand" title="Brand" intro="A C followed by a full stop. The dot is the pause, which is what a caesura is. The mark is dark on purpose: it holds up on any background and at 16px.">
          <Sub>Mark at sizes</Sub>
          <div className="flex flex-wrap items-end gap-6">
            {[
              ["h-24 w-24", "96"], ["h-16 w-16", "64"], ["h-10 w-10", "40"], ["h-6 w-6", "24"], ["h-4 w-4", "16"],
            ].map(([cls, label]) => (
              <div key={label} className="text-center">
                <LogoMark className={cls} />
                <p className="mt-1 font-mono text-[11px] text-zinc-500">{label}px</p>
              </div>
            ))}
          </div>

          <Sub>Lockups</Sub>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col items-start gap-5 rounded-2xl border border-zinc-200 bg-white p-8">
              <Logo href={null} size="xl" />
              <Logo href={null} size="md" />
              <Logo href={null} size="sm" />
            </div>
            <div className="flex flex-col items-start gap-5 rounded-2xl bg-zinc-950 p-8">
              <Logo href={null} size="xl" tone="light" />
              <Logo href={null} size="md" tone="light" />
              <Logo href={null} size="sm" tone="light" />
            </div>
          </div>
          <p className="mt-3 text-sm text-zinc-600">
            Always use <Code>{"<Logo />"}</Code>; <Code>tone=&quot;light&quot;</Code> on dark or photo backgrounds. Where it appears: home header, app nav,
            mobile menu, footer, auth pages, 404/500, favicon, iOS home-screen icon, share image, web manifest.
          </p>
        </Section>

        {/* ───────── Colour ───────── */}
        <Section id="color" title="Colour" intro="One accent (orange) and a neutral scale. Never raw orange-* or bg-black in code; use the tokens.">
          <Sub>Brand (orange)</Sub>
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
            {brand.map(([n, hex]) => (
              <Swatch key={n} name={n} hex={hex} token={`brand-${n}`} text={Number(n) >= 500 ? "#fff" : "#7c2d12"} />
            ))}
          </div>
          <p className="mt-3 text-sm text-zinc-600">
            <b>600</b> is the filled-button colour (white text passes contrast). <b>700</b> for brand text on white. <b>400</b> for brand text on dark.
            <b> 50 / 100 / 200</b> for tints and splashes.
          </p>

          <Sub>Ink &amp; surfaces (zinc)</Sub>
          <div className="grid grid-cols-5 gap-3 sm:grid-cols-10">
            {ink.map(([n, hex]) => (
              <Swatch key={n} name={n} hex={hex} token={`zinc-${n}`} text={Number(n) >= 500 ? "#fff" : "#18181b"} />
            ))}
          </div>
          <p className="mt-3 text-sm text-zinc-600">
            Headings <Code>zinc-950</Code> · body <Code>zinc-600</Code> · secondary <Code>zinc-500</Code> (never lighter for text) · card borders <Code>zinc-200</Code> · input borders <Code>zinc-300</Code> · dark sections <Code>zinc-950</Code>.
          </p>

          <Sub>Status</Sub>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Swatch name="Success bg" hex="#dcfce7" token="green-100" />
            <Swatch name="Success text" hex="#016630" token="green-800" text="#fff" />
            <Swatch name="Error bg" hex="#ffe2e2" token="red-100" />
            <Swatch name="Error text" hex="#e7000b" token="red-600" text="#fff" />
          </div>

          <Sub>Section rhythm on the homepage</Sub>
          <div className="flex h-14 overflow-hidden rounded-xl border border-zinc-200 text-[11px] font-semibold">
            {[
              ["Hero (photo)", "bg-zinc-900 text-white"], ["Features", "bg-white text-zinc-700"], ["Trending", "bg-brand-50 text-brand-700"],
              ["Stats", "bg-zinc-950 text-white"], ["Testimonials", "bg-zinc-50 text-zinc-700"], ["CTA", "bg-white text-zinc-700"], ["Footer", "bg-zinc-950 text-white"],
            ].map(([l, c]) => (
              <div key={l} className={`flex flex-1 items-center justify-center px-1 text-center ${c}`}>{l}</div>
            ))}
          </div>
        </Section>

        {/* ───────── Type ───────── */}
        <Section id="type" title="Typography" intro="Akaya Kanadaka for the brand voice (wordmark, hero, CTA, 404). Sora for everything else.">
          <div className="space-y-6">
            <div>
              <p className="mb-1 font-mono text-xs text-zinc-500">font-brand · text-7xl font-black</p>
              <p className="font-brand text-6xl font-black leading-none text-zinc-950 sm:text-7xl">Stories Worth <span className="text-brand-600">Reading</span></p>
            </div>
            {[
              ["Display / section title", "text-4xl md:text-5xl font-bold tracking-tight", "text-4xl font-bold tracking-tight md:text-5xl", "Built for readers and storytellers"],
              ["Page title", "text-3xl sm:text-4xl font-extrabold tracking-tight", "text-3xl font-extrabold tracking-tight sm:text-4xl", "My stories"],
              ["Card title", "text-lg font-semibold", "text-lg font-semibold", "Creator Publishing"],
              ["Lead", "text-lg text-zinc-600", "text-lg text-zinc-600", "A focused place to get stories discovered and keep creators moving."],
              ["Body", "text-[15px] text-zinc-600", "text-[15px] text-zinc-600", "Publish chapters in minutes, schedule releases, and keep your readership engaged."],
              ["Small", "text-sm text-zinc-500", "text-sm text-zinc-500", "Member since March 2025"],
            ].map(([label, cls, apply, sample]) => (
              <div key={label} className="grid gap-1 border-b border-zinc-100 pb-5 md:grid-cols-[14rem_1fr] md:gap-6">
                <div>
                  <p className="text-sm font-semibold text-zinc-900">{label}</p>
                  <p className="font-mono text-[11px] text-zinc-500">{cls}</p>
                </div>
                <p className={apply}>{sample}</p>
              </div>
            ))}
            <div className="grid gap-1 md:grid-cols-[14rem_1fr] md:gap-6">
              <div>
                <p className="text-sm font-semibold text-zinc-900">Eyebrow</p>
                <p className="font-mono text-[11px] text-zinc-500">.eyebrow · .eyebrow-light</p>
              </div>
              <div className="flex flex-wrap items-center gap-6">
                <p className="eyebrow">Platform</p>
                <span className="rounded-lg bg-zinc-950 px-3 py-2"><p className="eyebrow eyebrow-light">Scale</p></span>
              </div>
            </div>
          </div>
        </Section>

        {/* ───────── Buttons ───────── */}
        <Section id="buttons" title="Buttons" intro="Always pill-shaped. One definition (.btn) plus a variant and a size. Disabled state comes from the disabled attribute, not a class.">
          <Sub>Variants (size lg)</Sub>
          <div className="flex flex-wrap items-center gap-3">
            <button className="btn btn-primary btn-lg">Primary <ArrowRight className="h-4 w-4" /></button>
            <button className="btn btn-dark btn-lg">Dark</button>
            <button className="btn btn-outline btn-lg">Outline</button>
            <button className="btn btn-primary btn-lg" disabled>Disabled</button>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-3 rounded-2xl bg-zinc-950 p-6">
            <button className="btn btn-primary btn-lg">Primary</button>
            <button className="btn btn-outline-light btn-lg">Outline light</button>
          </div>

          <Sub>Sizes</Sub>
          <div className="flex flex-wrap items-center gap-3">
            <button className="btn btn-dark btn-md">btn-md</button>
            <button className="btn btn-dark btn-lg">btn-lg</button>
            <button className="btn btn-dark min-h-9 px-3 text-xs">compact (cards)</button>
          </div>

          <Sub>With icons &amp; icon-only</Sub>
          <div className="flex flex-wrap items-center gap-3">
            <button className="btn btn-primary btn-md"><PenLine className="h-4 w-4" /> Write</button>
            <button className="btn btn-outline btn-md"><RefreshCw className="h-4 w-4" /> Try again</button>
            <button className="btn btn-outline h-11 w-11 !p-0" aria-label="Previous"><ChevronLeft className="h-5 w-5" /></button>
            <button className="btn btn-outline h-11 w-11 !p-0" aria-label="Next"><ChevronRight className="h-5 w-5" /></button>
          </div>
          <Sub>Store badges</Sub>
          <div className="flex flex-wrap items-center gap-5">
            <StoreBadge platform="ios" href="https://example.com" />
            <StoreBadge platform="android" href="https://example.com" />
            <StoreBadge platform="ios" />
            <StoreBadge platform="android" />
          </div>
          <p className="mt-3 text-sm text-zinc-600">
            Live badges link to the store; without a URL they show &ldquo;Soon&rdquo;. URLs live in <Code>lib/app-links.ts</Code> and power <Code>/download</Code>.
          </p>

          <p className="mt-6 text-sm text-zinc-600">Tab to a button to see the focus treatment: a single 2px orange outline, never combined with a border change.</p>
        </Section>

        {/* ───────── Navigation ───────── */}
        <Section id="nav" title="Navigation" intro="Two bars, one behaviour. Home uses the transparent-to-floating-pill header; every other page uses the plain AppNav. Both open the same slide-in mobile menu from a MenuButton.">
          <Sub>Menu button (mobile)</Sub>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-zinc-200 bg-white p-6">
              <p className="mb-4 text-xs font-semibold text-zinc-500">On light</p>
              <div className="flex flex-wrap items-center gap-6">
                {(["pill", "dots", "lines"] as const).map((v) => (
                  <div key={v} className="text-center">
                    <MenuButton variant={v} onClick={() => toast(`${v} menu button`)} />
                    <p className="mt-2 font-mono text-[11px] text-zinc-500">{v}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl bg-zinc-950 p-6">
              <p className="mb-4 text-xs font-semibold text-zinc-400">On dark / photo</p>
              <div className="flex flex-wrap items-center gap-6">
                {(["pill", "dots", "lines"] as const).map((v) => (
                  <div key={v} className="text-center">
                    <MenuButton variant={v} tone="light" onClick={() => toast(`${v} menu button`)} />
                    <p className="mt-2 font-mono text-[11px] text-zinc-400">{v}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <p className="mt-3 text-sm text-zinc-600">
            <b>pill</b> (default, used in both headers) shows a &ldquo;Menu&rdquo; label so it&apos;s unmistakable; its two bars swap lengths on hover. Hover each one to see its motion.
          </p>
          <Sub>Mobile menu</Sub>
          <p className="max-w-2xl text-sm text-zinc-600">
            A slide-in sheet (<Code>components/layout/mobile-menu.tsx</Code>): blurred backdrop, large links with icon tiles, highlighted current page, and sign-up / account actions pinned to the bottom. Resize below 768px and tap the Menu button in any header to see it.
          </p>
        </Section>

        {/* ───────── Forms ───────── */}
        <Section id="forms" title="Forms & feedback" intro="Errors and successes after submitting use toasts. Alerts are for persistent, in-page messages. Field-level validation stays under the field.">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-5">
              <div>
                <label htmlFor="ds-email" className="mb-2 block text-sm font-medium text-zinc-700">Email</label>
                <input id="ds-email" className="field" placeholder="you@example.com" />
              </div>
              <div>
                <label htmlFor="ds-pw" className="mb-2 block text-sm font-medium text-zinc-700">Password</label>
                <PasswordInput id="ds-pw" placeholder="At least 8 characters" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700">Disabled</label>
                <input className="field" placeholder="Not editable" disabled />
              </div>
              <label className="flex items-start gap-3 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-xs leading-relaxed text-zinc-600">
                <input type="checkbox" className="mt-0.5 h-4 w-4 accent-orange-600" />
                <span>Checkbox row (terms, preferences).</span>
              </label>
            </div>

            <div className="space-y-6">
              <div>
                <Sub>Toasts</Sub>
                <div className="flex flex-wrap gap-2">
                  <button className="btn btn-outline btn-md" onClick={() => toast.success("Chapter saved")}>Success</button>
                  <button className="btn btn-outline btn-md" onClick={() => toast.error("Couldn't sign you in", { description: "Invalid email or password" })}>Error</button>
                  <button className="btn btn-outline btn-md" onClick={() => { const id = toast.loading("Adding to library…"); setTimeout(() => toast.success("Added!", { id }), 1200); }}>Loading → success</button>
                </div>
              </div>
              <div>
                <Sub>Modal</Sub>
                <button className="btn btn-outline btn-md" onClick={() => setModalOpen(true)}>Open modal</button>
                <Modal
                  open={modalOpen}
                  onRequestClose={() => setModalOpen(false)}
                  title="Edit profile"
                  description="Centred card on desktop, bottom sheet on phones."
                  footer={<div className="flex justify-end gap-2"><button className="btn btn-outline btn-md" onClick={() => setModalOpen(false)}>Cancel</button><button className="btn btn-primary btn-md" onClick={() => setModalOpen(false)}>Save changes</button></div>}
                >
                  <p className="text-sm text-zinc-600">Esc, the backdrop and the close button all call onRequestClose, so the parent can ask before discarding unsaved edits.</p>
                </Modal>
              </div>
              <div>
                <Sub>Alerts (inline)</Sub>
                <div className="space-y-3">
                  <Alert tone="error" title="Couldn't load your stories">Please try again in a moment.</Alert>
                  <Alert tone="success">Your password has been changed.</Alert>
                  <Alert tone="info">Drafts are only visible to you.</Alert>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* ───────── Surfaces ───────── */}
        <Section id="surfaces" title="Surfaces" intro="Cards, tiles, badges and chips. Hover lift is opt-in with card-interactive.">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="card p-6">
              <span className="icon-tile mb-4"><BookOpen className="h-5 w-5" /></span>
              <p className="font-semibold text-zinc-950">.card</p>
              <p className="mt-1 text-sm text-zinc-600">White, 1px zinc-200 border, 20px radius.</p>
            </div>
            <div className="card card-interactive p-6">
              <span className="icon-tile mb-4"><Compass className="h-5 w-5" /></span>
              <p className="font-semibold text-zinc-950">.card-interactive</p>
              <p className="mt-1 text-sm text-zinc-600">Hover me: lifts, border warms, soft shadow.</p>
            </div>
            <div className="rounded-3xl bg-zinc-950 p-6 text-white">
              <span className="icon-tile mb-4 !bg-brand-600 !text-white"><Star className="h-5 w-5" /></span>
              <p className="font-semibold">Dark tile</p>
              <p className="mt-1 text-sm text-zinc-300">For emphasis blocks and featured testimonials.</p>
            </div>
          </div>

          <Sub>Badges</Sub>
          <div className="flex flex-wrap gap-2">
            <span className="badge badge-brand">badge-brand</span>
            <span className="badge badge-neutral">badge-neutral · Draft</span>
            <span className="badge badge-success">badge-success · Published</span>
          </div>

          <Sub>Chips (filters)</Sub>
          <div className="flex flex-wrap gap-2">
            {["All", "Fantasy", "Romance", "Sci-Fi"].map((c) => (
              <button key={c} className="chip" aria-pressed={chip === c} onClick={() => setChip(c)}>{c}</button>
            ))}
          </div>
        </Section>

        {/* ───────── Patterns ───────── */}
        <Section id="patterns" title="Patterns" intro="Flat vector decoration only: no blur, no glow. Tint with text-* colour. Parent must be relative + overflow-hidden. Keep them muted on dark sections.">
          <div className="grid gap-4 sm:grid-cols-3">
            {(["a", "b", "c"] as const).map((v) => (
              <div key={v} className="relative h-48 overflow-hidden rounded-2xl border border-zinc-200 bg-white">
                <Splash variant={v} className={`${v === "b" ? "-bottom-10 -right-10 h-44 w-64" : v === "a" ? "-right-12 -top-16 h-56 w-56" : "left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2"} text-brand-300`} />
                <p className="relative p-4 text-sm font-semibold text-zinc-900">Splash variant {v}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div className="relative h-32 overflow-hidden rounded-2xl border border-zinc-200 bg-white"><DotPattern className="inset-0 text-zinc-300" /><p className="relative p-4 text-sm font-semibold">.pattern-dots</p></div>
            <div className="relative h-32 overflow-hidden rounded-2xl border border-zinc-200 bg-white"><div className="pattern-grid absolute inset-0 text-zinc-200" /><p className="relative p-4 text-sm font-semibold">.pattern-grid</p></div>
            <div className="relative h-32 overflow-hidden rounded-2xl border border-zinc-200 bg-white"><div className="pattern-stripes absolute inset-0 text-zinc-300" /><p className="relative p-4 text-sm font-semibold">.pattern-stripes</p></div>
          </div>
          <Sub>Wave dividers</Sub>
          <div className="overflow-hidden rounded-2xl border border-zinc-200">
            <div className="bg-brand-50 px-6 py-5 text-sm font-semibold text-brand-700">Section above (brand-50)</div>
            <div className="relative bg-zinc-950 px-6 py-24 text-center text-white">
              <WaveDivider position="top" variant="a" className="text-brand-50" />
              <WaveDivider position="bottom" variant="b" className="text-zinc-50" />
              <p className="relative text-sm font-semibold">Dark band with <code className="font-mono text-xs">WaveDivider</code> top + bottom</p>
            </div>
            <div className="bg-zinc-50 px-6 py-5 text-sm font-semibold text-zinc-700">Section below (zinc-50)</div>
          </div>

          <Sub>On dark and on brand</Sub>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="relative h-44 overflow-hidden rounded-2xl bg-zinc-950">
              <Splash variant="a" className="-left-16 -top-24 h-64 w-64 text-brand-600/15" />
              <DotPattern className="inset-0 text-white/[0.07]" />
              <p className="relative p-5 text-sm font-semibold text-white">Dark section: splash at 10–15% opacity</p>
            </div>
            <div className="relative h-44 overflow-hidden rounded-2xl bg-brand-600">
              <Splash variant="a" className="-right-16 -top-24 h-64 w-64 text-brand-500" />
              <p className="relative p-5 text-sm font-semibold text-white">Brand tile (small blocks only, never full sections)</p>
            </div>
          </div>
        </Section>

        {/* ───────── States ───────── */}
        <Section id="states" title="States" intro="Every loading, empty and failure case uses one of these. No bare red boxes, no plain 'Loading…' text.">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="card"><EmptyState icon={PenLine} title="Start your first story" description="Every great author started somewhere." action={<button className="btn btn-primary btn-md"><Plus className="h-4 w-4" /> Create new story</button>} /></div>
            <div className="card"><ErrorState title="Failed to load stories" onRetry={() => toast("Retrying…")} backHref="/" backLabel="Home" /></div>
            <div className="card"><PageLoader label="Loading your story…" /></div>
            <div className="card p-6">
              <p className="mb-3 text-sm font-semibold text-zinc-900">Skeleton (.skeleton)</p>
              <div className="skeleton mb-3 h-32 rounded-xl" />
              <div className="skeleton mb-2 h-3 w-3/4 rounded" />
              <div className="skeleton h-3 w-1/2 rounded" />
            </div>
          </div>
          <p className="mt-4 text-sm text-zinc-600">
            Full-page 404 and 500 use <Code>StatusPage</Code>: try <a className="font-semibold text-brand-700 underline" href="/this-page-does-not-exist">a missing page</a>.
          </p>
        </Section>

        {/* ───────── Icons ───────── */}
        <Section id="icons" title="Icons" intro="Lucide (lucide-react). h-4 w-4 beside text, h-5 w-5 in icon tiles, strokeWidth 1.6 for large decorative icons. No pasted SVG paths (only brand marks Lucide lacks, e.g. social logos).">
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-9">
            {iconSet.map(([name, Icon]) => (
              <div key={name} className="flex flex-col items-center gap-2 rounded-xl border border-zinc-200 bg-white px-2 py-4 text-center">
                <Icon className="h-5 w-5 text-zinc-800" />
                <span className="break-all font-mono text-[10px] text-zinc-500">{name}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* ───────── Shape ───────── */}
        <Section id="shape" title="Radius & shadow">
          <div className="grid gap-4 sm:grid-cols-4">
            {[["rounded-xl", "Inputs, rows"], ["rounded-2xl", "Cards, menus"], ["rounded-3xl", "Panels, hero tiles"], ["rounded-full", "Buttons, chips, badges"]].map(([r, l]) => (
              <div key={r} className={`flex h-24 flex-col items-center justify-center border border-zinc-300 bg-zinc-50 text-center ${r}`}>
                <p className="font-mono text-xs text-zinc-800">{r}</p>
                <p className="text-[11px] text-zinc-500">{l}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-white p-6 shadow-card"><p className="font-mono text-xs">shadow-card</p><p className="text-sm text-zinc-500">Hovering cards</p></div>
            <div className="rounded-2xl bg-white p-6 shadow-pop"><p className="font-mono text-xs">shadow-pop</p><p className="text-sm text-zinc-500">Menus, popovers</p></div>
          </div>
        </Section>

        {/* ───────── Rules ───────── */}
        <Section id="rules" title="Rules" intro="The short version. Full detail in DESIGN_SYSTEM.md.">
          <ul className="grid gap-3 md:grid-cols-2">
            {[
              "One accent: orange. Everything else is zinc.",
              "Flat and crisp: no blurred glows, orbs or animated blobs.",
              "A bordered element never also gets an outline or ring.",
              "Everything clickable is a real button/link; cursor and focus are global.",
              "Use <Logo />, never bare 'Caesura' text for the brand.",
              "Use shared classes (.btn, .field, .card, .chip, .badge) before writing new styles.",
              "Failed loads use <ErrorState />; submit feedback uses toasts.",
              "Signed-in pages: AppNav → PageHero → content; empty states via <EmptyState />.",
            ].map((r) => (
              <li key={r} className="flex items-start gap-3 rounded-xl border border-zinc-200 bg-white p-4 text-sm text-zinc-700">
                <CircleCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-600" />
                {r}
              </li>
            ))}
          </ul>
          <div className="mt-10">
            <SectionHeading align="left" eyebrow="Reference" title="Icon explorations" description="Alternative icon directions and lockups are kept for inspiration." />
            <a href="/icon-options" className="btn btn-outline btn-md mt-5">Open icon explorations <ArrowRight className="h-4 w-4" /></a>
          </div>
        </Section>
      </div>
    </main>
  );
}
