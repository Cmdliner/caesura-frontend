"use client";

import { useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { Check, ChevronLeft, ChevronRight, Copy, Mail, Share2 } from "lucide-react";
import { toast } from "sonner";
import Modal from "@/components/ui/modal";
import {
  SHARE_TARGETS,
  canNativeShare,
  copyText,
  nativeShare,
  openShareTarget,
  type SharePayload,
} from "@/lib/share";

interface ShareSheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  payload: SharePayload;
}

function Tile({ label, color, onClick, children }: { label: string; color: string; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-[4.5rem] flex-shrink-0 snap-start flex-col items-center gap-2 rounded-2xl p-1 text-xs font-medium text-zinc-700 transition-colors hover:text-zinc-950"
    >
      <span
        className="flex h-14 w-14 items-center justify-center rounded-full text-white transition-transform group-hover:scale-105 group-active:scale-95"
        style={{ backgroundColor: color }}
      >
        {children}
      </span>
      {label}
    </button>
  );
}

const subscribeNone = () => () => {};

/**
 * Share dialog: a swipeable row of apps, the system share sheet where the browser offers one, and a copy-link field.
 * Used for profiles; works for any URL.
 */
export default function ShareSheet({ open, onClose, title, description, payload }: ShareSheetProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  // Evaluated on the client only, so server and client markup never disagree.
  const nativeAvailable = useSyncExternalStore(subscribeNone, canNativeShare, () => false);

  const scroll = (dir: 1 | -1) => rowRef.current?.scrollBy({ left: dir * 240, behavior: "smooth" });

  const copy = async () => {
    const ok = await copyText(payload.url);
    if (ok) {
      setCopied(true);
      toast.success("Link copied");
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error("Couldn't copy the link", { description: "Select it and copy manually." });
    }
  };

  const shareNatively = async () => {
    try {
      if (await nativeShare(payload)) onClose();
    } catch {
      toast.error("Couldn't open the share menu");
    }
  };

  return (
    <Modal open={open} onRequestClose={onClose} title={title} description={description}>
      <div className="relative -mx-1">
        <div
          ref={rowRef}
          className="scrollbar-hide flex snap-x snap-mandatory gap-2 overflow-x-auto px-1 pb-1"
          role="list"
          aria-label="Share to"
        >
          {nativeAvailable && (
            <Tile label="More…" color="#ea580c" onClick={shareNatively}>
              <Share2 className="h-6 w-6" />
            </Tile>
          )}
          {SHARE_TARGETS.map((t) => (
            <Tile key={t.id} label={t.label} color={t.color} onClick={() => openShareTarget(t, payload)}>
              {t.path ? (
                <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current" aria-hidden="true">
                  <path d={t.path} />
                </svg>
              ) : (
                <Mail className="h-6 w-6" />
              )}
            </Tile>
          ))}
        </div>
        <button
          type="button"
          onClick={() => scroll(-1)}
          aria-label="Scroll apps left"
          className="absolute -left-5 top-5 hidden h-8 w-8 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-600 shadow-sm transition-colors hover:text-zinc-950 sm:flex"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => scroll(1)}
          aria-label="Scroll apps right"
          className="absolute -right-5 top-5 hidden h-8 w-8 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-600 shadow-sm transition-colors hover:text-zinc-950 sm:flex"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-5">
        <label htmlFor="share-link" className="mb-2 block text-sm font-medium text-zinc-700">
          Or copy the link
        </label>
        <div className="flex gap-2">
          <input
            id="share-link"
            readOnly
            value={payload.url}
            onFocus={(e) => e.currentTarget.select()}
            className="field min-w-0 flex-1 text-zinc-600"
          />
          <button type="button" onClick={copy} className="btn btn-dark btn-md flex-shrink-0">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
