import type { ReactNode } from "react";
import { DotPattern, Splash } from "@/components/ui/patterns";

interface PageHeroProps {
  title: ReactNode;
  description?: ReactNode;
  eyebrow?: string;
  /** Shown above the title, e.g. a back link. */
  top?: ReactNode;
  /** Right-aligned actions (buttons, filters). */
  actions?: ReactNode;
  /** Anything that belongs under the title, e.g. filter pills or tabs. */
  children?: ReactNode;
  /** Match the page's content container. */
  containerClassName?: string;
  /**
   * `compact`: a single slim row (title + count inline, actions on the right) so the page's
   * actual content starts near the top. Use for browse/list pages (Library, Discover).
   */
  compact?: boolean;
}

/** Header band for every signed-in page: brand splash + dots, title, optional actions. */
export default function PageHero({
  title,
  description,
  eyebrow,
  top,
  actions,
  children,
  containerClassName = "container-app",
  compact = false,
}: PageHeroProps) {
  if (compact) {
    return (
      <div className="relative overflow-hidden border-b border-zinc-200 bg-white">
        <Splash variant="a" className="-right-20 -top-28 h-60 w-60 text-brand-100" />
        <div className={`relative ${containerClassName} animate-fade-up py-4`}>
          {top && <div className="mb-2">{top}</div>}
          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
            <div className="flex min-w-0 items-baseline gap-3">
              <h1 className="text-2xl font-extrabold tracking-tight text-zinc-950">{title}</h1>
              {description && <p className="truncate text-sm text-zinc-500">{description}</p>}
            </div>
            {actions && <div className="flex min-w-0 max-w-full flex-wrap items-center gap-2">{actions}</div>}
          </div>
          {children && <div className="mt-3">{children}</div>}
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden border-b border-zinc-200 bg-white">
      <Splash variant="a" className="-right-24 -top-32 h-[22rem] w-[22rem] text-brand-100" />
      <Splash variant="c" className="right-[22%] top-6 hidden h-24 w-24 text-brand-200 md:block" />
      <DotPattern className="inset-y-0 left-0 hidden w-72 text-zinc-300/60 [mask-image:linear-gradient(to_right,black,transparent)] md:block" />

      <div className={`relative ${containerClassName} animate-fade-up py-8 sm:py-10`}>
        {top && <div className="mb-4">{top}</div>}
        <div className="flex items-end justify-between gap-4">
          <div className="min-w-0">
            {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-950 sm:text-4xl">{title}</h1>
            {description && <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-zinc-600">{description}</p>}
          </div>
          {actions && <div className="flex flex-shrink-0 items-center gap-2">{actions}</div>}
        </div>
        {children && <div className="mt-6">{children}</div>}
      </div>
    </div>
  );
}
