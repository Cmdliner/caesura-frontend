/**
 * Who built Caesura. Powers the "Built with love by …" credit in the footer.
 *
 * - `avatar`: put an image in /public (e.g. /abiade.jpg) and set the path. Falls back to an initial.
 * - `contacts`: only entries with a non-empty `href` are shown in the tooltip.
 *   Use full URLs, or `mailto:you@example.com` for email.
 */
export type AuthorContact = {
  kind: "email" | "github" | "x" | "linkedin" | "website";
  label: string;
  href: string;
};

export const author: {
  /** Shown in the footer line: "Built with love by <shortName>". */
  shortName: string;
  /** Shown in the tooltip. */
  name: string;
  role: string;
  /** Tiny tags under the name. */
  interests: string[];
  bio: string;
  avatar: string | null;
  contacts: AuthorContact[];
} = {
  shortName: "Abiade",
  name: "Abiade Abdulazeez",
  role: "Software engineer",
  interests: ["Poetry", "Fantasy", "Code"],
  bio: "I write poetry, scribble stories and get lost in fantasy books. Caesura is where all of that meets my day job.",
  avatar: null,
  contacts: [
    { kind: "email", label: "Email", href: "" },
    { kind: "linkedin", label: "LinkedIn", href: "" },
    { kind: "x", label: "Twitter / X", href: "" },
    { kind: "github", label: "GitHub", href: "https://github.com/Cmdliner" },
    { kind: "website", label: "Website", href: "" },
  ],
};
