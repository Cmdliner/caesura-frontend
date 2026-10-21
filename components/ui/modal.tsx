"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  /** Called for Esc, the backdrop, and the close button. The parent decides whether to actually close. */
  onRequestClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
}

/**
 * Dialog built on the native <dialog> element: focus is trapped, the page behind is inert and Esc works for free.
 * Centred card on desktop, bottom sheet on phones.
 */
export default function Modal({ open, onRequestClose, title, description, children, footer }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby="modal-title"
      onCancel={(e) => {
        e.preventDefault();
        onRequestClose();
      }}
      onMouseDown={(e) => {
        if (e.target === ref.current) onRequestClose();
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-lg flex-col overflow-hidden rounded-3xl border-0 bg-white p-0 text-zinc-950 shadow-pop open:flex max-h-[min(90dvh,48rem)] backdrop:bg-zinc-950/40 max-sm:mb-0 max-sm:w-full max-sm:max-w-none max-sm:rounded-b-none"
    >
      <div className="flex items-start justify-between gap-4 border-b border-zinc-100 px-5 py-4 sm:px-6">
        <div className="min-w-0">
          <h2 id="modal-title" className="text-lg font-extrabold tracking-tight">
            {title}
          </h2>
          {description && <p className="mt-0.5 text-sm text-zinc-500">{description}</p>}
        </div>
        <button
          type="button"
          onClick={onRequestClose}
          aria-label="Close"
          className="-mr-2 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-950"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">{children}</div>

      {footer && (
        <div className="border-t border-zinc-100 bg-zinc-50 px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-6">
          {footer}
        </div>
      )}
    </dialog>
  );
}
