import { Globe, Heart, Mail } from "lucide-react";
import type { ReactNode } from "react";
import { author, type AuthorContact } from "@/lib/author";

const brandIcons: Record<"github" | "x" | "linkedin", ReactNode> = {
  github: (
    <path
      fill="currentColor"
      d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z"
    />
  ),
  x: (
    <path
      fill="currentColor"
      d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
    />
  ),
  linkedin: (
    <path
      fill="currentColor"
      d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z"
    />
  ),
};

function ContactIcon({ kind }: { kind: AuthorContact["kind"] }) {
  if (kind === "email") return <Mail className="h-4 w-4" />;
  if (kind === "website") return <Globe className="h-4 w-4" />;
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      {brandIcons[kind]}
    </svg>
  );
}

function Avatar({ size }: { size: "sm" | "lg" }) {
  const dims = size === "sm" ? "h-7 w-7 text-xs" : "h-12 w-12 text-lg";
  return author.avatar ? (
    <img src={author.avatar} alt="" className={`${dims} rounded-full object-cover`} />
  ) : (
    <span className={`${dims} flex items-center justify-center rounded-full bg-brand-600 font-bold text-white`}>
      {author.shortName[0]}
    </span>
  );
}

/** "Built with love by …" with a white hover/focus card that introduces the author. */
export default function AuthorCredit() {
  const contacts = author.contacts.filter((c) => c.href);

  return (
    <p className="flex items-center justify-center gap-1.5 text-sm text-zinc-500">
      Built with
      <Heart className="h-4 w-4 fill-red-500 text-red-500" aria-label="love" />
      by
      <span className="group relative inline-flex">
        <button
          type="button"
          aria-describedby="author-card"
          className="inline-flex items-center gap-2 rounded-full py-0.5 pl-0.5 pr-3 font-semibold text-white transition-colors hover:bg-white/10"
        >
          <Avatar size="sm" />
          {author.shortName}
        </button>

        {/* Tooltip. pb-3 keeps the hover path unbroken between trigger and card so links stay clickable. */}
        <span
          id="author-card"
          role="tooltip"
          className="invisible absolute bottom-full left-1/2 z-30 w-64 -translate-x-1/2 translate-y-1 pb-3 text-left opacity-0 transition-all duration-200 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100"
        >
          <span className="relative block rounded-2xl border border-zinc-200 bg-white p-4 shadow-[0_12px_40px_rgba(0,0,0,0.25)]">
            <span className="flex items-center gap-3">
              <Avatar size="lg" />
              <span className="min-w-0">
                <span className="block text-sm font-bold text-zinc-950">{author.name}</span>
                <span className="block text-xs font-medium text-brand-700">{author.role}</span>
              </span>
            </span>

            {contacts.length > 0 && (
              <span className="mt-3 block border-t border-zinc-100 pt-3">
                <span className="flex flex-wrap gap-2">
                  {contacts.map((c) => (
                    <a
                      key={c.kind}
                      href={c.href}
                      {...(c.kind === "email" ? {} : { target: "_blank", rel: "noopener noreferrer" })}
                      aria-label={c.label}
                      title={c.label}
                      className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
                    >
                      <ContactIcon kind={c.kind} />
                      {c.label}
                    </a>
                  ))}
                </span>
              </span>
            )}

            {/* Arrow */}
            <span className="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-b border-r border-zinc-200 bg-white" />
          </span>
        </span>
      </span>
    </p>
  );
}
