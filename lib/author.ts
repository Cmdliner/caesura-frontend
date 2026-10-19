/**
 * Who built Caesura. Powers the "Built with love by …" credit in the footer.
 *
 * - `avatar`: put an image in /public (e.g. /cmdliner.jpg) and set the path. Falls back to an initial.
 * - `contacts`: only entries with a non-empty `href` are shown in the tooltip.
 *   Use full URLs, or `mailto:you@example.com` for email.
 */
export type AuthorContact = {
  kind: "email" | "github" | "x" | "linkedin" | "website";
  label: string;
  href: string;
};

export const author: {
  name: string;
  role: string;
  bio: string;
  avatar: string | null;
  contacts: AuthorContact[];
} = {
  name: "Cmdliner",
  role: "Developer & maker of Caesura",
  bio: "I build things for the web, and I made Caesura to give stories and the people who write them a better home.",
  avatar: null,
  contacts: [
    { kind: "email", label: "Email", href: "" },
    { kind: "github", label: "GitHub", href: "" },
    { kind: "x", label: "X", href: "" },
    { kind: "linkedin", label: "LinkedIn", href: "" },
    { kind: "website", label: "Website", href: "" },
  ],
};
