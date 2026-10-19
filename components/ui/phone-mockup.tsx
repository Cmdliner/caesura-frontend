import { ArrowLeft, BookOpen, Compass, Library, PenLine, Search, User } from "lucide-react";
import type { ReactNode } from "react";
import { LogoMark } from "@/components/ui/logo";

const covers = [
  "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=300&q=70",
  "https://images.unsplash.com/photo-1495640388908-05fa85288e61?auto=format&fit=crop&w=300&q=70",
  "https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&w=300&q=70",
];

/** Device frame. Illustrative only: the screens below are drawn, not real app screenshots. */
export function Phone({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`relative aspect-[9/18.5] w-[15.5rem] flex-shrink-0 overflow-hidden rounded-[2.6rem] border-[7px] border-zinc-900 bg-white shadow-[0_30px_80px_rgba(0,0,0,0.25)] ${className}`}
    >
      <div className="absolute left-1/2 top-2 z-20 h-5 w-20 -translate-x-1/2 rounded-full bg-zinc-900" />
      {children}
    </div>
  );
}

function TabBar({ active }: { active: "discover" | "library" }) {
  const items = [
    { id: "discover", icon: Compass },
    { id: "library", icon: Library },
    { id: "write", icon: PenLine },
    { id: "me", icon: User },
  ];
  return (
    <div className="absolute inset-x-0 bottom-0 flex justify-around border-t border-zinc-100 bg-white/95 px-2 pb-3 pt-2.5 backdrop-blur">
      {items.map(({ id, icon: Icon }) => (
        <span
          key={id}
          className={`flex h-9 w-9 items-center justify-center rounded-full ${id === active ? "bg-brand-100 text-brand-700" : "text-zinc-400"}`}
        >
          <Icon className="h-[18px] w-[18px]" />
        </span>
      ))}
    </div>
  );
}

/** Home / library screen. */
export function LibraryScreen() {
  return (
    <div className="absolute inset-0 bg-zinc-50 px-3.5 pt-10">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <LogoMark className="h-6 w-6" />
          <span className="font-brand text-lg font-black leading-none text-zinc-950">Caesura</span>
        </span>
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-zinc-500 shadow-sm">
          <Search className="h-3.5 w-3.5" />
        </span>
      </div>

      <p className="mt-4 text-[10px] font-semibold uppercase tracking-widest text-brand-700">Continue reading</p>
      <div className="mt-1.5 flex gap-3 rounded-2xl bg-white p-2.5 shadow-sm">
        <img src={covers[0]} alt="" className="h-20 w-14 rounded-lg object-cover" />
        <div className="min-w-0 flex-1 pt-1">
          <p className="truncate text-[12px] font-bold text-zinc-950">The Midnight Library</p>
          <p className="text-[10px] text-zinc-500">Chapter 4 · Sarah Chen</p>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-zinc-100">
            <div className="h-full w-2/3 rounded-full bg-brand-600" />
          </div>
          <p className="mt-1 text-[9px] font-medium text-zinc-500">64% read</p>
        </div>
      </div>

      <p className="mt-4 text-[10px] font-semibold uppercase tracking-widest text-brand-700">Trending now</p>
      <div className="mt-1.5 grid grid-cols-3 gap-2">
        {covers.map((src, i) => (
          <div key={i}>
            <img src={src} alt="" className="aspect-[2/3] w-full rounded-lg object-cover shadow-sm" />
            <span className="mt-1 block h-1.5 w-4/5 rounded bg-zinc-200" />
            <span className="mt-1 block h-1.5 w-1/2 rounded bg-zinc-100" />
          </div>
        ))}
      </div>

      <div className="mt-4 flex gap-1.5">
        {["Fantasy", "Romance", "Sci-Fi"].map((g, i) => (
          <span key={g} className={`rounded-full px-2.5 py-1 text-[9px] font-semibold ${i === 0 ? "bg-zinc-900 text-white" : "bg-white text-zinc-600"}`}>
            {g}
          </span>
        ))}
      </div>

      <TabBar active="library" />
    </div>
  );
}

/** Reader screen. */
export function ReaderScreen() {
  return (
    <div className="absolute inset-0 bg-white px-4 pt-10">
      <div className="flex items-center justify-between text-zinc-500">
        <ArrowLeft className="h-4 w-4" />
        <span className="text-[10px] font-semibold text-zinc-700">The Midnight Library</span>
        <BookOpen className="h-4 w-4" />
      </div>
      <div className="mt-2 h-0.5 overflow-hidden rounded-full bg-zinc-100">
        <div className="h-full w-2/3 bg-brand-600" />
      </div>

      <p className="mt-6 text-center text-[9px] font-bold uppercase tracking-[0.2em] text-brand-700">Chapter four</p>
      <h3 className="mt-1 text-center font-brand text-2xl font-black leading-tight text-zinc-950">The Shelf That Wasn&apos;t There</h3>

      <div className="mt-5 space-y-3 text-[11px] leading-[1.7] text-zinc-700">
        <p>
          <span className="float-left mr-1 font-brand text-4xl font-black leading-[0.8] text-brand-600">T</span>
          he library opened only at midnight, and only for those who had stopped looking for it. Nora ran a finger along the spines until one
          of them, warm as a held breath, slid forward on its own.
        </p>
        <p>Every shelf, she realised, held a life she had not lived. This one smelled of rain and unfinished letters.</p>
        <p className="text-zinc-400">She opened it to the first page and the room went quiet in a way that felt like listening.</p>
      </div>
    </div>
  );
}
