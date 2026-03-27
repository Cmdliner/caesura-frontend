export default function Testimonials() {
  const testimonials = [
    {
      id: 1,
      quote:
        "Caesura helped me build a loyal readership chapter by chapter. The feedback loop is unreal.",
      author: "Jessica Moreno",
      role: "Fantasy Author",
      image:
        "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      id: 2,
      quote:
        "I came for one story and ended up filling my TBR for months. Discovery feels effortless here.",
      author: "David Kim",
      role: "Avid Reader",
      image:
        "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      id: 3,
      quote:
        "From drafting to publishing, this is the cleanest platform I have used to grow as a writer.",
      author: "Maria Laurent",
      role: "Romance Creator",
      image:
        "https://randomuser.me/api/portraits/women/68.jpg",
    },
  ];

  return (
    <section className="bg-white px-6 py-20 md:px-12 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-orange-500">Testimonials</p>
          <h2 className="mb-4 text-4xl font-bold tracking-tight text-zinc-950 md:text-5xl">What Our Community Says</h2>
          <p className="text-lg text-zinc-600">Trusted by readers and writers building stories that stick.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <article
              key={testimonial.id}
              className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-[0_6px_24px_rgba(0,0,0,0.06)] transition-shadow duration-300 hover:shadow-[0_12px_36px_rgba(0,0,0,0.14)]"
            >
              <div className="mb-5 flex items-center gap-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.author}
                  className="h-14 w-14 rounded-full object-cover"
                  loading="lazy"
                />
                <div>
                  <p className="text-base font-semibold text-zinc-950">{testimonial.author}</p>
                  <p className="text-sm text-zinc-500">{testimonial.role}</p>
                </div>
              </div>

              <p className="mb-5 text-zinc-700">"{testimonial.quote}"</p>

              <div className="text-sm font-medium text-orange-500">★★★★★</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
