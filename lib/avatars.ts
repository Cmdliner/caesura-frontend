/**
 * Preset avatars. A user's `avatar_url` is either `preset:<id>` (one of these), or a plain https link
 * (kept for accounts whose picture came from Google). Keep the ids in sync with the backend's `AvatarPresets`.
 */
export const AVATAR_PRESETS = [
  { id: "fox", label: "Bookish Fox" },
  { id: "owl", label: "Night Owl" },
  { id: "cat", label: "Library Cat" },
  { id: "bookworm", label: "Bookworm" },
  { id: "penguin", label: "Cosy Penguin" },
  { id: "bear", label: "Tea Bear" },
  { id: "robot", label: "Reading Robot" },
  { id: "ghost", label: "Page Ghost" },
  { id: "dragon", label: "Story Dragon" },
] as const;

const PREFIX = "preset:";

export const presetValue = (id: string) => `${PREFIX}${id}`;

export function presetId(avatarUrl?: string | null): string | null {
  if (!avatarUrl?.startsWith(PREFIX)) return null;
  const id = avatarUrl.slice(PREFIX.length);
  return AVATAR_PRESETS.some((p) => p.id === id) ? id : null;
}

/** The image URL to render, or undefined when the user has none (show initials). */
export function avatarSrc(avatarUrl?: string | null): string | undefined {
  if (!avatarUrl) return undefined;
  if (avatarUrl.startsWith(PREFIX)) {
    const id = presetId(avatarUrl);
    return id ? `/avatars/${id}.svg` : undefined;
  }
  return avatarUrl;
}
