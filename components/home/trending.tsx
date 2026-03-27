import Link from "next/link";

export default function Trending() {
  const stories = [
    {
      id: 1,
      title: "The Midnight Library",
      author: "Sarah Chen",
      category: "Fantasy",
      reads: "2.3M",
      rating: 4.8,
      cover:
        "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: 2,
      title: "Echo Of Tomorrow",
      author: "Marcus Rivera",
      category: "Sci-Fi",
      reads: "1.9M",
      rating: 4.7,
      cover:
        "https://images.unsplash.com/photo-1495640388908-05fa85288e61?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: 3,
      title: "Whispers In The Garden",
      author: "Elena Rodriguez",
      category: "Romance",
      reads: "2.1M",
      rating: 4.9,
      cover:
        "https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: 4,
      title: "The Last Word",
      author: "James Murphy",
      category: "Mystery",
      reads: "1.7M",
      rating: 4.6,
      cover:
        "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=900&q=80",
    },
  ];

  return (
    <section className="bg-zinc-50 px-6 py-20 md:px-12 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-orange-500">Hot Shelf</p>
          <h2 className="mb-4 text-4xl font-bold tracking-tight text-zinc-950 md:text-5xl">Trending Now</h2>
          <p className="text-lg text-zinc-600">The stories readers are bingeing this week.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {stories.map((story) => (
            <article
              key={story.id}
              className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-[0_6px_24px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_36px_rgba(0,0,0,0.14)]"
            >
              <div className="relative h-52 overflow-hidden">
                <img
                  src={story.cover}
                  alt={`${story.title} cover`}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <span className="absolute left-3 top-3 rounded-full bg-black/75 px-3 py-1 text-xs font-semibold text-white">
                  {story.category}
                </span>
              </div>

              <div className="p-5">
                <h3 className="mb-1 text-xl font-semibold text-zinc-950">{story.title}</h3>
                <p className="mb-4 text-sm text-zinc-600">by {story.author}</p>

                <div className="mb-5 flex items-center justify-between text-sm text-zinc-500">
                  <span>{story.reads} reads</span>
                  <span>★ {story.rating}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href="/discover"
                    className="inline-flex flex-1 items-center justify-center rounded-full bg-orange-500 px-3 py-2 text-sm font-semibold text-white transition-colors duration-300 hover:bg-black"
                  >
                    Read Now
                  </Link>
                  <button
                    type="button"
                    className="inline-flex flex-1 items-center justify-center rounded-full border border-zinc-300 px-3 py-2 text-sm font-semibold text-zinc-700 transition-colors duration-300 hover:border-zinc-900 hover:text-zinc-900"
                  >
                    Add To TBR
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
