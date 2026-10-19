import type { Metadata } from "next";
import type { ReactNode } from "react";

/**
 * Design reference: icon explorations kept for inspiration (not linked from the site).
 * The live icon is app/icon.svg, currently variant 7A. To switch, copy another variant's
 * shapes from here into that file.
 */
export const metadata: Metadata = {
  title: "Icon explorations",
  robots: { index: false, follow: false },
};

const O = "#ea580c"; // brand orange
const O2 = "#fb923c"; // lighter orange
const D = "#18181b"; // zinc-950
const A = "#fbbf24"; // amber

type Variant = { id: string; name: string; note: string; svg: ReactNode };

const Tile = ({ fill = O, stroke }: { fill?: string; stroke?: string }) => (
  <rect width="64" height="64" rx="15" fill={fill} stroke={stroke} strokeWidth={stroke ? 2 : 0} />
);

/* The "C" geometry for option 7: centre (30,32), r15, opening on the right. */
const CArc = ({ color, width = 7 }: { color: string; width?: number }) => (
  <path d="M41.5 22.4A15 15 0 1 0 41.5 41.6" fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" />
);

/* ───────────── Option 7, explored ───────────── */
const sevens: Variant[] = [
  {
    id: "7A",
    name: "Dark · orange C · white dot",
    note: "The one you liked. Highest contrast in a tab strip.",
    svg: (
      <>
        <Tile fill={D} />
        <CArc color={O} />
        <circle cx="49.5" cy="43" r="4.5" fill="#fff" />
      </>
    ),
  },
  {
    id: "7B",
    name: "Orange tile · white C · dark dot",
    note: "Brand-colour tile; the dot reads as the pause.",
    svg: (
      <>
        <Tile fill={O} />
        <CArc color="#fff" />
        <circle cx="49.5" cy="43" r="4.5" fill={D} />
      </>
    ),
  },
  {
    id: "7C",
    name: "White tile · orange C · dark dot",
    note: "Light and clean; works well on dark browser themes.",
    svg: (
      <>
        <Tile fill="#fff" stroke="#e4e4e7" />
        <CArc color={O} />
        <circle cx="49.5" cy="43" r="4.5" fill={D} />
      </>
    ),
  },
  {
    id: "7D",
    name: "Dark · white C · orange dot",
    note: "Inverted: the orange is only the full stop. Most refined, least colourful.",
    svg: (
      <>
        <Tile fill={D} />
        <CArc color="#fff" />
        <circle cx="49.5" cy="43" r="4.8" fill={O} />
      </>
    ),
  },
  {
    id: "7E",
    name: "Round (avatar)",
    note: "Circle version for profile pictures and social.",
    svg: (
      <>
        <circle cx="32" cy="32" r="32" fill={D} />
        <CArc color={O} />
        <circle cx="49.5" cy="43" r="4.5" fill="#fff" />
      </>
    ),
  },
  {
    id: "7F",
    name: "Dot in the opening",
    note: "C•: the dot sits inside the gap, so it reads as one compact mark.",
    svg: (
      <>
        <Tile fill={D} />
        <path d="M41 21.6A15.5 15.5 0 1 0 41 42.4" fill="none" stroke={O} strokeWidth="7" strokeLinecap="round" />
        <circle cx="47.5" cy="32" r="4.6" fill="#fff" />
      </>
    ),
  },
  {
    id: "7G",
    name: "Warm gradient",
    note: "Orange gradient tile with depth; white C and dot.",
    svg: (
      <>
        <defs>
          <linearGradient id="g7" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={O2} />
            <stop offset="1" stopColor="#c2410c" />
          </linearGradient>
        </defs>
        <rect width="64" height="64" rx="15" fill="url(#g7)" />
        <CArc color="#fff" />
        <circle cx="49.5" cy="43" r="4.5" fill="#fff" />
      </>
    ),
  },
  {
    id: "7H",
    name: "Dark · orange C · amber dot",
    note: "Two-tone accent: the pause glows amber.",
    svg: (
      <>
        <Tile fill={D} />
        <CArc color={O} />
        <circle cx="49.5" cy="43" r="4.8" fill={A} />
      </>
    ),
  },
];

/* ───────────── The other options ───────────── */
const others: Variant[] = [
  {
    id: "1",
    name: "Open book",
    note: "The universal reading symbol.",
    svg: (
      <>
        <Tile />
        <path d="M10 22c8-4 15-3 20 2v26c-5-5-12-6-20-2Z" fill="#fff" />
        <path d="M54 22c-8-4-15-3-20 2v26c5-5 12-6 20-2Z" fill="#fff" />
      </>
    ),
  },
  {
    id: "2",
    name: "Bookshelf",
    note: "Books side by side; one leans.",
    svg: (
      <>
        <Tile />
        <rect x="14" y="13" width="10" height="36" rx="3" fill="#fff" />
        <rect x="28" y="13" width="10" height="36" rx="3" fill="#fff" />
        <rect x="42" y="19" width="10" height="30" rx="3" fill="#fff" fillOpacity=".75" transform="rotate(14 47 49)" />
        <rect x="10" y="51" width="44" height="4" rx="2" fill="#fff" />
      </>
    ),
  },
  {
    id: "3",
    name: "Pen nib",
    note: "Writing is half the product.",
    svg: (
      <>
        <Tile />
        <path d="M32 8 45 30c0 8-6 15-13 25C25 45 19 38 19 30Z" fill="#fff" />
        <circle cx="32" cy="29" r="3.4" fill={O} />
        <path d="M32 31v17" stroke={O} strokeWidth="3" strokeLinecap="round" />
      </>
    ),
  },
  {
    id: "4",
    name: "Bookmark c",
    note: "Where you left off.",
    svg: (
      <>
        <Tile />
        <path d="M19 9h26v46L32 44 19 55Z" fill="#fff" />
        <path d="M36.2 22.6A6.6 6.6 0 1 0 36.2 31.4" fill="none" stroke={O} strokeWidth="4" strokeLinecap="round" />
      </>
    ),
  },
  {
    id: "5",
    name: "Ink drop",
    note: "The moment a story starts.",
    svg: (
      <>
        <Tile />
        <path d="M32 8s16 19 16 30a16 16 0 0 1-32 0C16 27 32 8 32 8Z" fill="#fff" />
        <path d="M23.5 38a8.5 8.5 0 0 0 8.5 8.5" fill="none" stroke={O} strokeWidth="3.5" strokeLinecap="round" />
      </>
    ),
  },
  {
    id: "6",
    name: "Page, paused",
    note: "A manuscript with a caesura.",
    svg: (
      <>
        <Tile />
        <path d="M17 9h21l11 11v35H17Z" fill="#fff" />
        <path d="M38 9v11h11" fill="none" stroke={O} strokeWidth="3" strokeLinejoin="round" opacity=".55" />
        <rect x="25" y="28" width="5.5" height="18" rx="2.2" fill={O} />
        <rect x="35" y="28" width="5.5" height="18" rx="2.2" fill={O} />
      </>
    ),
  },
  {
    id: "8",
    name: "Line of verse",
    note: "The middle line breaks mid-line.",
    svg: (
      <>
        <Tile />
        <rect x="11" y="15" width="42" height="6.5" rx="3.25" fill="#fff" />
        <rect x="11" y="28.5" width="16" height="6.5" rx="3.25" fill="#fff" />
        <rect x="33" y="28.5" width="20" height="6.5" rx="3.25" fill="#fff" />
        <rect x="11" y="42" width="28" height="6.5" rx="3.25" fill="#fff" />
      </>
    ),
  },
  {
    id: "9",
    name: "Feather quill",
    note: "Literary and recognisable at 16px.",
    svg: (
      <>
        <Tile />
        <path d="M49 10C32 10 19 21 17 39l-4 15 15-6c17-2 25-17 21-38Z" fill="#fff" />
        <path d="M14 53 38 25" stroke={O} strokeWidth="3" strokeLinecap="round" />
      </>
    ),
  },
  {
    id: "10",
    name: "Open book + pause",
    note: "Story and name in one shape.",
    svg: (
      <>
        <Tile />
        <path d="M9 28c8-4 15-3 20 2v22c-5-5-12-6-20-2Z" fill="#fff" />
        <path d="M55 28c-8-4-15-3-20 2v22c5-5 12-6 20-2Z" fill="#fff" />
        <path d="M29.5 9 26.5 24M37.5 9 34.5 24" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
      </>
    ),
  },
];

function Svg({ size, children, className = "" }: { size: number; children: ReactNode; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" className={`shrink-0 ${className}`}>
      {children}
    </svg>
  );
}

function Lockup({ v, dark }: { v: Variant; dark?: boolean }) {
  return (
    <div className={`flex items-center gap-3 rounded-xl px-4 py-3 ${dark ? "bg-zinc-950" : "bg-white border border-zinc-200"}`}>
      <Svg size={40}>{v.svg}</Svg>
      <span className={`font-brand text-3xl font-black leading-none ${dark ? "text-white" : "text-zinc-950"}`}>Caesura</span>
    </div>
  );
}

function Tab({ v, dark }: { v: Variant; dark?: boolean }) {
  return (
    <div className={`flex items-center gap-2 rounded-t-lg px-3 py-2 ${dark ? "bg-zinc-800 text-zinc-100" : "bg-white text-zinc-800 border border-b-0 border-zinc-200"}`}>
      <Svg size={16}>{v.svg}</Svg>
      <span className="text-xs">Caesura: Read and share stories</span>
    </div>
  );
}

function Phone({ v }: { v: Variant }) {
  const ghost = ["bg-sky-300", "bg-emerald-300", "bg-violet-300", "bg-rose-300", "bg-yellow-300", "bg-teal-300"];
  return (
    <div className="w-44 rounded-[1.75rem] border-[5px] border-zinc-800 bg-gradient-to-b from-indigo-200 to-pink-200 p-3 shadow-lg">
      <div className="grid grid-cols-4 gap-2.5">
        {ghost.slice(0, 3).map((c, i) => (
          <span key={i} className={`aspect-square rounded-[0.7rem] ${c} opacity-70`} />
        ))}
        <span className="aspect-square">
          <Svg size={36} className="h-full w-full">{v.svg}</Svg>
        </span>
        {ghost.slice(3).map((c, i) => (
          <span key={i} className={`aspect-square rounded-[0.7rem] ${c} opacity-70`} />
        ))}
        <span className="flex aspect-square flex-col items-center">
          <span />
        </span>
      </div>
      <p className="mt-1 grid grid-cols-4 text-center text-[8px] font-medium text-zinc-700">
        <span /> <span /> <span /> <span>Caesura</span>
      </p>
    </div>
  );
}

function Card({ v, big }: { v: Variant; big?: boolean }) {
  return (
    <article className="card p-5">
      <div className="flex items-start gap-5">
        <Svg size={big ? 128 : 96}>{v.svg}</Svg>
        <div className="min-w-0">
          <p className="text-xs font-bold text-zinc-400">OPTION {v.id}</p>
          <h3 className="font-bold text-zinc-950">{v.name}</h3>
          <p className="mt-1 text-[13px] leading-relaxed text-zinc-600">{v.note}</p>
          <div className="mt-3 flex items-end gap-3">
            <Svg size={48}>{v.svg}</Svg>
            <Svg size={32}>{v.svg}</Svg>
            <Svg size={16}>{v.svg}</Svg>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-2.5">
        <Lockup v={v} />
        <Lockup v={v} dark />
      </div>

      <div className="mt-4 flex items-end gap-2 overflow-hidden rounded-lg bg-zinc-200 px-2 pt-2">
        <Tab v={v} />
        <Tab v={v} dark />
      </div>
    </article>
  );
}

export default function IconOptions() {
  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <p className="eyebrow mb-2">Design reference</p>
        <h1 className="text-4xl font-extrabold tracking-tight text-zinc-950">Caesura icon options</h1>
        <p className="mt-2 max-w-2xl text-zinc-600">
          Every design is shown large, at 48/32/16px, as a wordmark lockup on light and dark, and as a browser tab on light and dark
          themes. The live site icon is <b>7A</b> (<code>app/icon.svg</code>); to switch, copy another variant&apos;s shapes into that file.
        </p>

        {/* Option 7 */}
        <h2 className="mt-12 text-2xl font-bold text-zinc-950">Option 7 explored: &ldquo;C.&rdquo;</h2>
        <p className="mt-1 max-w-2xl text-sm text-zinc-600">
          The C is the brand; the full stop is the pause (a caesura). Eight ways to colour and frame it.
        </p>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {sevens.map((v) => (
            <Card key={v.id} v={v} big />
          ))}
        </div>

        {/* Phone */}
        <h2 className="mt-14 text-2xl font-bold text-zinc-950">On a phone home screen</h2>
        <p className="mt-1 text-sm text-zinc-600">How the leading 7 variants look next to other apps.</p>
        <div className="mt-6 flex flex-wrap gap-6">
          {[sevens[0], sevens[1], sevens[3], sevens[6]].map((v) => (
            <div key={v.id} className="text-center">
              <Phone v={v} />
              <p className="mt-2 text-xs font-semibold text-zinc-500">{v.id}</p>
            </div>
          ))}
        </div>

        {/* Others */}
        <h2 className="mt-14 text-2xl font-bold text-zinc-950">The other nine ideas</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {others.map((v) => (
            <Card key={v.id} v={v} />
          ))}
        </div>
      </div>
    </main>
  );
}
