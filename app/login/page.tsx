"use client";

import Link from "next/link";
import { useState } from "react";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <section className="relative min-h-[100dvh] overflow-x-hidden bg-[#f6f8fc] px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1.5rem,env(safe-area-inset-top))] sm:px-6 sm:py-12 sm:pb-12">
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.82),rgba(255,255,255,0.94)),radial-gradient(circle_at_18%_12%,rgba(255,162,84,0.08),transparent_36%),radial-gradient(circle_at_82%_18%,rgba(109,126,255,0.08),transparent_38%)]" />
      <div className="absolute inset-0 opacity-[0.045] bg-[linear-gradient(rgba(30,41,59,0.65)_1px,transparent_1px),linear-gradient(90deg,rgba(30,41,59,0.65)_1px,transparent_1px)] [background-size:32px_32px] sm:[background-size:44px_44px]" />
      <div
        className="absolute -left-20 top-20 h-64 w-64 rounded-full bg-orange-300/45 blur-3xl"
        style={{ animation: "bubble1 4.8s ease-in-out infinite", animationDelay: "0s" }}
      />
      <div
        className="absolute right-[-100px] top-28 h-72 w-72 rounded-full bg-orange-200/50 blur-3xl"
        style={{ animation: "bubble2 5.4s ease-in-out infinite", animationDelay: "-1.2s" }}
      />
      <div
        className="absolute bottom-[-100px] left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-white/75 blur-3xl"
        style={{ animation: "bubble4 4.6s ease-in-out infinite", animationDelay: "-0.8s" }}
      />
      <div
        className="absolute left-[12%] top-[34%] h-28 w-28 rounded-full bg-orange-300/35 blur-2xl"
        style={{ animation: "bubble3 4.2s ease-in-out infinite", animationDelay: "-1.5s" }}
      />
      <div
        className="absolute right-[18%] top-[42%] h-20 w-20 rounded-full bg-white/80 blur-xl"
        style={{ animation: "bubble1 3.8s ease-in-out infinite", animationDelay: "-2.1s" }}
      />
      <div
        className="absolute left-[24%] bottom-[18%] h-24 w-24 rounded-full bg-orange-200/45 blur-xl"
        style={{ animation: "bubble2 4.4s ease-in-out infinite", animationDelay: "-1.8s" }}
      />
      <div
        className="absolute right-[28%] bottom-[12%] h-16 w-16 rounded-full bg-orange-400/30 blur-lg"
        style={{ animation: "bubble4 3.9s ease-in-out infinite", animationDelay: "-2.4s" }}
      />
      <div
        className="absolute left-[50%] top-[16%] h-14 w-14 -translate-x-1/2 rounded-full bg-white/85 blur-md"
        style={{ animation: "bubble3 3.6s ease-in-out infinite", animationDelay: "-1.1s" }}
      />
      <div
        className="absolute left-[8%] bottom-[32%] hidden h-12 w-12 rounded-full bg-orange-500/25 blur-md sm:block"
        style={{ animation: "bubble1 3.2s ease-in-out infinite", animationDelay: "-2.7s" }}
      />
      <div
        className="absolute right-[8%] bottom-[35%] hidden h-10 w-10 rounded-full bg-white/90 blur-sm sm:block"
        style={{ animation: "bubble2 3.4s ease-in-out infinite", animationDelay: "-1.9s" }}
      />

      <div className="relative z-10 mx-auto w-full max-w-5xl">
        <div className="mb-6 flex flex-nowrap items-center justify-between gap-2 sm:mb-10 sm:gap-3">
          <Link
            href="/"
            className="shrink-0 text-4xl leading-none font-black font-brand text-black sm:text-5xl"
            aria-label="Caesura home"
          >
            Caesura
          </Link>
          <Link
            href="/"
            className="shrink-0 whitespace-nowrap rounded-full border border-black/15 bg-white/60 px-3 py-2 text-xs font-medium text-black backdrop-blur-sm transition-colors duration-300 hover:bg-black hover:text-white sm:px-5 sm:py-2 sm:text-sm"
          >
            Back to Home
          </Link>
        </div>

        <div className="mx-auto w-full max-w-md rounded-2xl border border-zinc-200/80 bg-white/90 p-5 shadow-[0_8px_40px_rgba(15,23,42,0.06),0_1px_0_rgba(255,255,255,0.8)_inset] backdrop-blur-sm sm:p-8 md:p-10">
          <p className="mb-2 text-center text-[10px] font-semibold tracking-[0.2em] text-orange-500 sm:text-xs">
            WELCOME BACK
          </p>
          <h1 className="mb-2 text-center text-2xl font-extrabold tracking-tight text-zinc-900 sm:text-3xl md:text-4xl">
            Sign in
          </h1>
          <p className="mb-6 text-center text-sm leading-relaxed text-zinc-500 sm:mb-8">
            Enter your email to continue to your library and drafts.
          </p>

          <form className="space-y-4 sm:space-y-5">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-zinc-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className="min-h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-base text-zinc-900 shadow-sm placeholder:text-zinc-400 outline-none ring-0 transition-[border-color,box-shadow] duration-200 focus:border-orange-400 focus:shadow-[0_0_0_3px_rgba(251,146,60,0.15)] sm:min-h-0 sm:text-[15px]"
              />
            </div>

            <div>
              <div className="mb-2 flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
                <label htmlFor="password" className="block text-sm font-medium text-zinc-700">
                  Password
                </label>
                <button
                  type="button"
                  className="w-fit text-left text-xs font-medium text-orange-600 transition-colors hover:text-orange-700 sm:text-xs"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="min-h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 pr-12 text-base text-zinc-900 shadow-sm placeholder:text-zinc-400 outline-none ring-0 transition-[border-color,box-shadow] duration-200 focus:border-orange-400 focus:shadow-[0_0_0_3px_rgba(251,146,60,0.15)] sm:min-h-0 sm:text-[15px]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-0 flex min-h-11 min-w-11 items-center justify-center text-zinc-400 transition-colors hover:text-zinc-700 sm:min-h-0 sm:min-w-12"
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
                      <path
                        d="M3 3l18 18M10.58 10.58a2 2 0 102.83 2.83M9.88 5.09A10.94 10.94 0 0112 5c5 0 9.27 3.11 11 7-1 2.24-2.74 4.12-4.96 5.3M6.61 6.61C4.62 7.9 3.1 9.77 2 12c.63 1.45 1.57 2.78 2.73 3.89A10.94 10.94 0 0012 19c1.85 0 3.6-.46 5.12-1.27"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
                      <path
                        d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="mt-1 min-h-12 w-full rounded-xl bg-zinc-900 px-6 py-3.5 text-base font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-orange-500 sm:text-[15px]"
            >
              Continue
            </button>
          </form>

          <div className="my-5 flex items-center gap-3 sm:my-6 sm:gap-4">
            <div className="h-px flex-1 bg-zinc-200" />
            <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">or</span>
            <div className="h-px flex-1 bg-zinc-200" />
          </div>

          <button
            type="button"
            className="inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold text-zinc-800 shadow-sm transition-colors hover:border-zinc-300 hover:bg-zinc-50"
          >
            <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>

          <p className="mt-5 text-center text-sm leading-snug text-zinc-600 sm:mt-6">
            New to Caesura?{" "}
            <Link href="/signup" className="font-semibold text-orange-600 hover:text-orange-700">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}