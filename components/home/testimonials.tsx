export default function Testimonials() {
  const testimonials = [
    {
      id: 1,
      quote:
        "Caesura helped me build a loyal readership chapter by chapter. The feedback loop is unlike anything else.",
      author: "Jessica Moreno",
      role: "Fantasy Author",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      id: 2,
      quote:
        "I came for one story and ended up filling my reading list for months. Discovery feels completely effortless.",
      author: "David Kim",
      role: "Avid Reader",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      id: 3,
      quote:
        "From drafting to publishing, this is the cleanest platform I've used to grow as a writer.",
      author: "Maria Laurent",
      role: "Romance Creator",
      image: "https://randomuser.me/api/portraits/women/68.jpg",
    },
  ];

  return (
    <section className="bg-zinc-50 px-6 py-20 md:px-12 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-orange-500">
            Community
          </p>
          <h2 className="mb-4 text-4xl font-bold tracking-tight text-zinc-950 md:text-5xl">
            What Our Community Says
          </h2>
          <p className="text-lg text-zinc-600">
            Trusted by readers and writers building stories that stick.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {testimonials.map((t) => (
            <article
              key={t.id}
              className="relative rounded-2xl border border-zinc-200 bg-white p-7 shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_36px_rgba(0,0,0,0.1)] hover:border-orange-100"
            >
              {/* Decorative quote mark */}
              <div className="absolute top-6 right-7 text-5xl font-serif text-orange-100 leading-none select-none">
                "
              </div>

              {/* Stars */}
              <div className="mb-4 flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="h-4 w-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <p className="mb-6 leading-relaxed text-zinc-700 text-[15px]">
                &ldquo;{t.quote}&rdquo;
              </p>

              <div className="flex items-center gap-3 pt-5 border-t border-zinc-100">
                <img
                  src={t.image}
                  alt={t.author}
                  className="h-10 w-10 rounded-full object-cover"
                  loading="lazy"
                />
                <div>
                  <p className="text-sm font-semibold text-zinc-900">{t.author}</p>
                  <p className="text-xs text-zinc-500">{t.role}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
