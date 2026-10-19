import Link from "next/link";
import Logo from "@/components/ui/logo";
import type { ReactNode } from "react";
import { DotPattern, Splash } from "@/components/ui/patterns";

interface AuthBackdropProps {
  children: ReactNode;
  /** Width of the content column; signup is wider than the single-card pages. */
  maxWidth?: string;
}

/**
 * The frame shared by every auth page (login, signup, forgot/reset password):
 * flat background with brand splash corners, the wordmark, and a Back to Home link.
 */
export default function AuthBackdrop({ children, maxWidth = "max-w-5xl" }: AuthBackdropProps) {
  return (
    <section className="relative min-h-[100dvh] overflow-hidden bg-zinc-50 px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1.5rem,env(safe-area-inset-top))] sm:px-6 sm:py-12 sm:pb-12">
      <Splash variant="a" className="-left-32 -top-32 h-[26rem] w-[26rem] text-brand-200" />
      <Splash variant="b" className="-bottom-28 -right-28 h-[20rem] w-[26rem] text-brand-600" />
      <Splash variant="c" className="bottom-[14%] left-[7%] hidden h-24 w-24 text-brand-300 lg:block" />
      <DotPattern className="right-[6%] top-[12%] hidden h-40 w-56 text-zinc-300 lg:block" />

      <div className={`relative mx-auto w-full ${maxWidth}`}>
        <div className="mb-6 flex flex-nowrap items-center justify-between gap-2 sm:mb-10 sm:gap-3">
          <Logo size="xl" />
          <Link href="/" className="btn btn-outline px-4 py-2.5 text-xs sm:px-5 sm:text-sm">
            Back to Home
          </Link>
        </div>

        {children}
      </div>
    </section>
  );
}
