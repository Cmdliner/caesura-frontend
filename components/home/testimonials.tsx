import { Quote, Star } from "lucide-react";
import SectionHeading from "@/components/ui/section-heading";
import { Splash } from "@/components/ui/patterns";

const testimonials = [
  {
    id: 1,
    quote: "Caesura helped me build a loyal readership chapter by chapter. The feedback loop is unlike anything else.",
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
    featured: true,
  },
  {
    id: 3,
    quote: "From drafting to publishing, this is the cleanest platform I've used to grow as a writer.",
    author: "Maria Laurent",
    role: "Romance Creator",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
  },
];

export default function Testimonials() {
  return (
    <section className="section bg-zinc-50">
      <Splash variant="a" className="-left-40 -top-40 h-[26rem] w-[26rem] text-brand-100" />
      <Splash variant="c" className="-right-6 bottom-10 hidden h-36 w-36 text-brand-200 lg:block" />

      <div className="container-page relative">
        <SectionHeading
          eyebrow="Community"
          title="Loved by readers and writers"
          description="Trusted by people building stories that stick."
          className="mb-14"
        />

        <div className="grid items-stretch gap-5 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure
              key={t.id}
              className={`relative flex flex-col overflow-hidden rounded-3xl p-8 ${
                t.featured
                  ? "bg-zinc-950 text-white md:-my-4 md:py-12"
                  : "card"
              }`}
            >
              <Quote
                className={`mb-5 h-9 w-9 ${t.featured ? "text-brand-500" : "text-brand-600"}`}
                strokeWidth={1.8}
                fill="currentColor"
              />
              <div className="mb-4 flex gap-0.5" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-amber-400" fill="currentColor" strokeWidth={0} />
                ))}
              </div>
              <blockquote className={`flex-1 text-[17px] leading-relaxed ${t.featured ? "text-zinc-100" : "text-zinc-700"}`}>
                {t.quote}
              </blockquote>
              <figcaption className={`mt-8 flex items-center gap-3 border-t pt-6 ${t.featured ? "border-white/15" : "border-zinc-200"}`}>
                <img src={t.image} alt="" className="h-11 w-11 rounded-full object-cover" loading="lazy" />
                <div>
                  <p className={`text-sm font-semibold ${t.featured ? "text-white" : "text-zinc-950"}`}>{t.author}</p>
                  <p className={`text-xs ${t.featured ? "text-zinc-400" : "text-zinc-500"}`}>{t.role}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
