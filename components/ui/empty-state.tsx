import Link from "next/link";
import { CircleAlert, RefreshCw, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Splash } from "@/components/ui/patterns";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  /** `error` tints the icon red; used for failed loads. */
  tone?: "default" | "error";
  /** Centre in the viewport below the 60px app nav (for pages that have nothing else to show). */
  fullPage?: boolean;
}

/** Empty / error block used inside pages (lists, shelves, failed loads). */
export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  tone = "default",
  fullPage = false,
}: EmptyStateProps) {
  const error = tone === "error";
  return (
    <div
      className={`relative mx-auto flex max-w-md flex-col items-center justify-center overflow-hidden px-6 text-center animate-fade-up ${
        fullPage ? "min-h-[calc(100dvh-3.75rem)] pt-[60px]" : "py-20"
      }`}
    >
      <Splash variant="c" className={`${fullPage ? "top-1/4" : "-top-2"} left-1/2 h-40 w-40 -translate-x-1/2 ${error ? "text-red-100" : "text-brand-100"}`} />
      <span
        className={`relative mb-5 flex h-16 w-16 items-center justify-center rounded-2xl ${
          error ? "bg-red-100 text-red-600" : "bg-brand-100 text-brand-700"
        }`}
      >
        <Icon className="h-8 w-8" strokeWidth={1.6} />
      </span>
      <h2 className="relative text-xl font-bold text-zinc-950">{title}</h2>
      {description && <p className="relative mt-2 text-sm leading-relaxed text-zinc-600">{description}</p>}
      {action && <div className="relative mt-6 flex flex-wrap items-center justify-center gap-3">{action}</div>}
    </div>
  );
}

interface ErrorStateProps {
  title?: string;
  description?: string;
  /** Shows a Retry button. Defaults to reloading the page when omitted and `retry` is true. */
  onRetry?: () => void;
  backHref?: string;
  backLabel?: string;
  fullPage?: boolean;
}

/** Standard failed-load state: friendly copy, Retry, and an optional way back. */
export function ErrorState({
  title = "We couldn't load this",
  description = "Something went wrong on our end. Check your connection and try again.",
  onRetry,
  backHref,
  backLabel = "Go back",
  fullPage,
}: ErrorStateProps) {
  return (
    <EmptyState
      tone="error"
      icon={CircleAlert}
      title={title}
      description={description}
      fullPage={fullPage}
      action={
        <>
          <button type="button" onClick={onRetry ?? (() => window.location.reload())} className="btn btn-dark btn-md">
            <RefreshCw className="h-4 w-4" />
            Try again
          </button>
          {backHref && (
            <Link href={backHref} className="btn btn-outline btn-md">
              {backLabel}
            </Link>
          )}
        </>
      }
    />
  );
}

/** Centred spinner for full-page and section loading. */
export function PageLoader({ label = "Loading…", fullPage = false }: { label?: string; fullPage?: boolean }) {
  return (
    <div
      role="status"
      className={`flex flex-col items-center justify-center gap-4 ${fullPage ? "min-h-[calc(100dvh-3.75rem)] pt-[60px]" : "py-24"}`}
    >
      <span className="h-9 w-9 animate-spin rounded-full border-[3px] border-brand-100 border-t-brand-600" />
      <p className="text-sm text-zinc-500">{label}</p>
    </div>
  );
}
