import Link from "next/link";

export default function Cta() {
  return (
    <section className="relative overflow-hidden bg-zinc-950 py-20 md:py-28 px-6 md:px-12">
      {/* Background decoration */}
      <div className="pointer-events-none absolute -left-32 top-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-orange-600/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 top-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-orange-500/8 blur-3xl" />
      <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-0 h-40 w-96 bg-orange-500/6 blur-2xl" />

      <div className="relative max-w-3xl mx-auto text-center">
        {/* Label */}
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-orange-500">
          Get Started Free
        </p>

        <h2 className="text-4xl md:text-5xl font-black font-brand text-white mb-6 leading-tight">
          Ready to Start Your Journey?
        </h2>

        <p className="text-lg text-zinc-400 mb-10 max-w-xl mx-auto leading-relaxed">
          Join millions of readers and writers discovering stories that move them.
          Your next favorite read—or breakthrough as a writer—is waiting.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/discover"
            className="px-10 py-4 bg-orange-500 text-white font-bold rounded-full hover:bg-orange-400 transition-colors duration-200 text-[15px] shadow-lg shadow-orange-900/30 hover:-translate-y-0.5 hover:shadow-xl transition-all"
          >
            Start Reading Now
          </Link>
          <Link
            href="/create-story"
            className="px-10 py-4 border-2 border-zinc-700 text-zinc-300 font-bold rounded-full hover:border-white hover:text-white transition-all duration-200 text-[15px] hover:-translate-y-0.5"
          >
            Start Writing
          </Link>
        </div>

        <p className="text-zinc-600 mt-8 text-sm">
          Free to join · No credit card required
        </p>
      </div>
    </section>
  );
}
