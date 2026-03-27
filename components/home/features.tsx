export default function Features() {
  const features = [
    {
      title: "Editorial Discovery",
      description:
        "Surface high-quality reads with curated rails, genre spotlights, and personalized recommendations.",
    },
    {
      title: "Creator Publishing",
      description:
        "Publish chapters in minutes, schedule releases, and keep your readership engaged consistently.",
    },
    {
      title: "Reader Retention",
      description:
        "Bookmarks, progress sync, and notifications help readers stay invested from first chapter to finale.",
    },
    {
      title: "Community Signals",
      description:
        "Comments, reactions, and review threads provide meaningful feedback loops for writers and readers.",
    },
    {
      title: "Cross-Device Experience",
      description:
        "A clean, responsive interface across desktop and mobile with optimized reading comfort.",
    },
    {
      title: "Growth Analytics",
      description:
        "Track reads, completion rate, and engagement trends to understand what resonates with your audience.",
    },
  ];

  return (
    <section className="bg-white px-6 py-20 md:px-12 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-orange-500">Platform Advantage</p>
          <h2 className="mb-4 text-4xl font-bold tracking-tight text-zinc-950 md:text-5xl">Built For Readers And Storytellers</h2>
          <p className="text-lg text-zinc-600">A focused, product-grade experience designed to help stories get discovered and communities grow.</p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <article
              key={feature.title}
              className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-[0_6px_24px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-[0_12px_36px_rgba(0,0,0,0.12)]"
            >
              <div className="mb-5 flex items-center justify-between">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-zinc-950 text-sm font-semibold text-white">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="h-1.5 w-16 rounded-full bg-zinc-200 transition-colors duration-300 group-hover:bg-orange-500" />
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
