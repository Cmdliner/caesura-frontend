import { siFacebook, siReddit, siTelegram, siWhatsapp, siX } from "simple-icons";

export interface SharePayload {
  url: string;
  title: string;
  text: string;
}

export interface ShareTarget {
  id: string;
  label: string;
  /** Brand colour, used for the tile. */
  color: string;
  /** SVG path (24x24) of the brand mark; absent for Mail. */
  path?: string;
  href: (p: SharePayload) => string;
}

const enc = encodeURIComponent;

export const SHARE_TARGETS: ShareTarget[] = [
  {
    id: "whatsapp",
    label: "WhatsApp",
    color: `#${siWhatsapp.hex}`,
    path: siWhatsapp.path,
    href: (p) => `https://wa.me/?text=${enc(`${p.text} ${p.url}`)}`,
  },
  {
    id: "x",
    label: "X",
    color: "#09090b",
    path: siX.path,
    href: (p) => `https://twitter.com/intent/tweet?text=${enc(p.text)}&url=${enc(p.url)}`,
  },
  {
    id: "facebook",
    label: "Facebook",
    color: `#${siFacebook.hex}`,
    path: siFacebook.path,
    href: (p) => `https://www.facebook.com/sharer/sharer.php?u=${enc(p.url)}`,
  },
  {
    id: "telegram",
    label: "Telegram",
    color: `#${siTelegram.hex}`,
    path: siTelegram.path,
    href: (p) => `https://t.me/share/url?url=${enc(p.url)}&text=${enc(p.text)}`,
  },
  {
    id: "reddit",
    label: "Reddit",
    color: `#${siReddit.hex}`,
    path: siReddit.path,
    href: (p) => `https://www.reddit.com/submit?url=${enc(p.url)}&title=${enc(p.title)}`,
  },
  {
    id: "email",
    label: "Email",
    color: "#3f3f46",
    href: (p) => `mailto:?subject=${enc(p.title)}&body=${enc(`${p.text}\n${p.url}`)}`,
  },
];

/** An absolute URL for a site path, built from wherever the app is currently served. */
export const absoluteUrl = (path: string) => `${window.location.origin}${path}`;

export const canNativeShare = () => typeof navigator !== "undefined" && typeof navigator.share === "function";

/** Opens the system share sheet. Resolves false if the user dismissed it. */
export async function nativeShare(p: SharePayload): Promise<boolean> {
  try {
    await navigator.share({ title: p.title, text: p.text, url: p.url });
    return true;
  } catch (err) {
    if ((err as DOMException)?.name === "AbortError") return false;
    throw err;
  }
}

/** Clipboard API needs a secure context; fall back to a hidden textarea so http previews still work. */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fall through to the textarea path
  }
  const area = document.createElement("textarea");
  area.value = text;
  area.setAttribute("readonly", "");
  area.style.position = "fixed";
  area.style.opacity = "0";
  document.body.appendChild(area);
  area.select();
  try {
    return document.execCommand("copy");
  } finally {
    document.body.removeChild(area);
  }
}

export function openShareTarget(target: ShareTarget, payload: SharePayload) {
  const href = target.href(payload);
  if (href.startsWith("mailto:")) window.location.href = href;
  else window.open(href, "_blank", "noopener,noreferrer");
}
