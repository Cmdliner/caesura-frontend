import Link from "next/link";

export default function Cta() {
  return (
    <section className="bg-white px-6 py-20 md:px-12 md:py-24">
      <div
        className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-zinc-950 bg-cover bg-center px-6 py-16 text-center md:px-16 md:py-24"
        style={{ backgroundImage: "url('/images/hero-bg.avif')" }}
      >
        <div className="absolute inset-0 bg-zinc-950/80" />

        <div className="relative mx-auto max-w-2xl">
          <p className="eyebrow eyebrow-light mb-4">Get started free</p>

          <h2 className="mb-5 font-brand text-4xl font-black leading-tight text-white md:text-5xl">
            Ready to start your journey?
          </h2>

          <p className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-zinc-300">
            Join millions of readers and writers discovering stories that move them. Your next favourite read, or your
            breakthrough as a writer, is waiting.
          </p>

          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/discover" className="btn btn-primary btn-lg">
              Start Reading Now
            </Link>
            <Link href="/create-story" className="btn btn-outline-light btn-lg">
              Start Writing
            </Link>
          </div>

          <p className="mt-8 text-sm text-zinc-400">Free to join · No credit card required</p>
        </div>
      </div>
    </section>
  );
}
