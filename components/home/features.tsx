export default function Features() {
  const features: { icon: IconName; title: string; description: string }[] = [
    {
      icon: "compass",
      title: "Editorial Discovery",
      description:
        "Surface high-quality reads with curated rails, genre spotlights, and personalized recommendations.",
    },
    {
      icon: "pen",
      title: "Creator Publishing",
      description:
        "Publish chapters in minutes, schedule releases, and keep your readership engaged consistently.",
    },
    {
      icon: "bookmark",
      title: "Reader Retention",
      description:
        "Bookmarks, progress sync, and notifications help readers stay invested from first chapter to finale.",
    },
    {
      icon: "chat",
      title: "Community Signals",
      description:
        "Comments, reactions, and review threads provide meaningful feedback loops for writers and readers.",
    },
    {
      icon: "devices",
      title: "Cross-Device Experience",
      description:
        "A clean, responsive interface across desktop and mobile with optimized reading comfort.",
    },
    {
      icon: "chart",
      title: "Growth Analytics",
      description:
        "Track reads, completion rate, and engagement trends to understand what resonates with your audience.",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-white px-6 py-20 md:px-12 md:py-24">
      <div className="pointer-events-none absolute -left-16 top-10 h-44 w-44 rounded-full bg-orange-100 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-56 w-56 rounded-full bg-zinc-200/50 blur-3xl" />

      <div className="mx-auto max-w-6xl">
        <div className="mb-14 grid items-end gap-8 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-orange-500">Platform Advantage</p>
            <h2 className="mb-4 text-4xl font-bold tracking-tight text-zinc-950 md:text-5xl">Built For Readers And Storytellers</h2>
            <p className="max-w-2xl text-lg text-zinc-600">A focused, product-grade experience designed to help stories get discovered, communities grow, and creators sustain momentum.</p>
          </div>

          <aside className="rounded-2xl border border-zinc-200 bg-zinc-950 p-6 text-white shadow-[0_14px_40px_rgba(0,0,0,0.2)]">
            <p className="text-sm uppercase tracking-[0.14em] text-zinc-300">Live Snapshot</p>
            <p className="mt-4 text-4xl font-bold text-orange-500">87%</p>
            <p className="mt-2 text-sm text-zinc-300">Readers discover their next title via curated rails and tailored recommendations.</p>
          </aside>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <article
              key={feature.title}
              className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-[0_6px_24px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-orange-300 hover:shadow-[0_12px_36px_rgba(0,0,0,0.14)]"
            >
              <span className="absolute left-0 top-0 h-full w-1 bg-zinc-200 transition-colors duration-300 group-hover:bg-orange-500" />

              <div className="mb-5 flex items-center justify-between">
                <span className="inline-flex h-10 min-w-10 items-center justify-center rounded-md border border-zinc-300 bg-zinc-50 text-zinc-800 transition-colors duration-300 group-hover:border-orange-300 group-hover:text-orange-500">
                  <FeatureIcon name={feature.icon} />
                </span>
                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-400">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <h3 className="mb-3 text-xl font-semibold text-zinc-950">{feature.title}</h3>
              <p className="leading-relaxed text-zinc-600">{feature.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

type IconName = "compass" | "pen" | "bookmark" | "chat" | "devices" | "chart";

function FeatureIcon({ name }: { name: IconName }) {
  const common = "h-5 w-5";

  if (name === "compass") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={common}>
        <circle cx="12" cy="12" r="9" />
        <path d="M15.8 8.2 13.5 13.5 8.2 15.8l2.3-5.3 5.3-2.3Z" />
      </svg>
    );
  }

  if (name === "pen") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={common}>
        <path d="M4 20h4l10-10-4-4L4 16v4Z" />
        <path d="m13 7 4 4" />
      </svg>
    );
  }

  if (name === "bookmark") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={common}>
        <path d="M6 4h12v16l-6-3-6 3V4Z" />
      </svg>
    );
  }

  if (name === "chat") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={common}>
        <path d="M4 5h16v10H8l-4 4V5Z" />
        <path d="M8 9h8" />
        <path d="M8 12h5" />
      </svg>
    );
  }

  if (name === "devices") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={common}>
        <rect x="3" y="5" width="13" height="10" rx="1.5" />
        <rect x="17" y="8" width="4" height="9" rx="1" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={common}>
      <path d="M4 18h16" />
      <path d="M7 15V9" />
      <path d="M12 15V6" />
      <path d="M17 15v-3" />
    </svg>
  );
}
