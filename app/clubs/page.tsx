import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarDays, Compass, Library, MessagesSquare, Users } from "lucide-react";
import Header from "@/components/home/header";
import Cta from "@/components/home/cta";
import Footer from "@/components/layout/footer";
import SectionHeading from "@/components/ui/section-heading";
import { DotPattern, Splash } from "@/components/ui/patterns";
import { CommunityHero, DarkSteps, FeatureGrid } from "@/components/community/blocks";

export const metadata: Metadata = {
  title: "Reading Clubs",
  description: "Read together. Join a Caesura reading club, pick a book as a group and talk through it chapter by chapter.",
};

// Public-domain covers from Project Gutenberg (books readers can open on Caesura).
const cover = (id: number) => `https://www.gutenberg.org/cache/epub/${id}/pg${id}.cover.medium.jpg`;

const clubs = [
  { name: "Classics After Dark", genre: "Classics", book: 1342, progress: 64, members: 128 },
  { name: "Gothic & Gaslight", genre: "Gothic", book: 84, progress: 38, members: 86 },
  { name: "Slow Readers' Society", genre: "Literary", book: 345, progress: 82, members: 54 },
];

const features = [
  {
    icon: Library,
    title: "One book, together",
    description: "Pick a story as a group and read at the same pace, so there's always something to talk about.",
  },
  {
    icon: MessagesSquare,
    title: "Chapter-by-chapter discussion",
    description: "Every chapter gets its own thread, with spoiler-safe conversation for readers who haven't caught up.",
  },
  {
    icon: CalendarDays,
    title: "A rhythm that sticks",
    description: "Set a pace that suits the group and let gentle reminders keep everyone turning pages.",
  },
];

const steps = [
  { title: "Find a club", description: "Browse by genre or mood, or start one for the books you love." },
  { title: "Read along", description: "Follow the club's pick in the Caesura reader and track progress together." },
  { title: "Talk it through", description: "Share reactions chapter by chapter and see where the group lands." },
];

export default function ClubsPage() {
  return (
    <>
      <Header solid />
      <main>
        <CommunityHero
          current="/clubs"
          eyebrow="Reading Clubs"
          title={
            <>
              Every book is better <span className="text-brand-600">read together</span>
            </>
          }
          description="Join a club, pick a book as a group and talk through it chapter by chapter. Reading is quiet, but it doesn't have to be lonely."
          actions={
            <>
              <Link href="/discover" className="btn btn-primary btn-lg">
                Find a book to share
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/community" className="btn btn-outline btn-lg">
                Visit the forums
              </Link>
            </>
          }
        >
          {/* Club preview */}
          <div className="card overflow-hidden shadow-pop">
            <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4">
              <p className="flex items-center gap-2 text-sm font-bold text-zinc-950">
                <Users className="h-4 w-4 text-brand-600" />
                Clubs near your taste
              </p>
              <span className="badge badge-neutral">Preview</span>
            </div>
            <ul className="divide-y divide-zinc-100">
              {clubs.map((club) => (
                <li key={club.name} className="flex items-center gap-4 px-5 py-4">
                  <img
                    src={cover(club.book)}
                    alt=""
                    loading="lazy"
                    className="aspect-[2/3] w-12 flex-shrink-0 rounded-md object-cover shadow-card"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-zinc-950">{club.name}</p>
                    <p className="mt-0.5 text-xs text-zinc-500">
                      {club.genre} · {club.members} members
                    </p>
                    <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-zinc-100">
                      <div className="h-full rounded-full bg-brand-600" style={{ width: `${club.progress}%` }} />
                    </div>
                  </div>
                  <span className="flex-shrink-0 text-xs font-semibold text-zinc-600">{club.progress}%</span>
                </li>
              ))}
            </ul>
          </div>
        </CommunityHero>

        {/* Why */}
        <section className="section bg-zinc-50">
          <div className="container-page relative">
            <SectionHeading
              eyebrow="Why a club"
              title="Finish more books, enjoy them more"
              description="A little company turns reading from a habit into a highlight of the week."
              className="mb-14"
            />
            <FeatureGrid features={features} />
          </div>
        </section>

        {/* Club types */}
        <section className="section bg-white">
          <Splash variant="a" className="-right-40 -top-40 h-[26rem] w-[26rem] text-brand-100" />
          <DotPattern className="bottom-0 left-0 hidden h-48 w-80 text-zinc-300/70 [mask-image:linear-gradient(to_top_right,black,transparent)] md:block" />
          <div className="container-page relative grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="eyebrow mb-3">Start your own</p>
              <h2 className="text-4xl font-bold tracking-tight text-zinc-950 md:text-5xl">Bring your friends, or make new ones</h2>
              <p className="mt-4 text-lg leading-relaxed text-zinc-600">
                Clubs can be open to everyone or private to the people you invite. Choose the books, set the pace and
                make it yours.
              </p>
              <ul className="mt-8 space-y-4 text-[15px] text-zinc-700">
                {[
                  "Open clubs anyone can join",
                  "Private clubs for friends and classes",
                  "Moderator tools to keep things friendly",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span className="icon-tile !h-9 !w-9 flex-shrink-0">
                      <Compass className="h-4 w-4" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-3 gap-4" aria-hidden="true">
              {[1342, 84, 345, 11, 1661, 174].map((id, i) => (
                <img
                  key={id}
                  src={cover(id)}
                  alt=""
                  loading="lazy"
                  className={`aspect-[2/3] w-full rounded-xl object-cover shadow-card ring-1 ring-black/10 ${
                    i % 2 ? "translate-y-6" : ""
                  }`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="section bg-zinc-950">
          <Splash variant="a" className="-right-28 -top-36 h-[26rem] w-[26rem] text-brand-600/10" />
          <div className="container-page relative">
            <SectionHeading
              tone="dark"
              eyebrow="How it works"
              title="From first page to last"
              description="Three simple steps from curious to caught up."
              className="mb-14"
            />
            <DarkSteps steps={steps} />
          </div>
        </section>

        <Cta />
      </main>
      <Footer />
    </>
  );
}
