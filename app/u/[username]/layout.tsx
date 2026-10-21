import type { Metadata } from "next";
import type { ReactNode } from "react";
import { API_BASE_URL } from "@/lib/constants";

type Props = { params: Promise<{ username: string }>; children: ReactNode };

/** Gives a shared profile link a proper title and description in chat and social previews. */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  try {
    const res = await fetch(`${API_BASE_URL}/users/${encodeURIComponent(username)}/profile`, {
      next: { revalidate: 300 },
    });
    if (res.ok) {
      const p = (await res.json()) as { username: string; display_name?: string; bio?: string; stories_count: number };
      const name = p.display_name || p.username;
      const description =
        p.bio?.slice(0, 160) ||
        (p.stories_count > 0 ? `Read ${name}'s ${p.stories_count} stories on Caesura.` : `${name} is on Caesura.`);
      return {
        title: `${name} (@${p.username})`,
        description,
        openGraph: { title: `${name} on Caesura`, description, type: "profile" },
      };
    }
  } catch {
    // fall through to the generic title
  }
  return { title: `@${username}` };
}

export default function Layout({ children }: Props) {
  return children;
}
