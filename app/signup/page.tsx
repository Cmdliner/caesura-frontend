"use client";

import Link from "next/link";
import { useState } from "react";
import { Drawer } from "vaul";

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <section className="relative min-h-[100dvh] overflow-x-hidden bg-[#f6f8fc] px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1.5rem,env(safe-area-inset-top))] sm:px-6 sm:py-12 sm:pb-12">
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.82),rgba(255,255,255,0.94)),radial-gradient(circle_at_18%_12%,rgba(255,162,84,0.08),transparent_36%),radial-gradient(circle_at_82%_18%,rgba(109,126,255,0.08),transparent_38%)]" />
      <div className="absolute inset-0 opacity-[0.045] bg-[linear-gradient(rgba(30,41,59,0.65)_1px,transparent_1px),linear-gradient(90deg,rgba(30,41,59,0.65)_1px,transparent_1px)] [background-size:32px_32px] sm:[background-size:44px_44px]" />
      <div
        className="absolute -left-28 top-20 h-80 w-80 rounded-full bg-orange-200/14 blur-3xl"
        style={{ animation: "bubble1 8s ease-in-out infinite", animationDelay: "0s" }}
      />
      <div
        className="absolute right-[-130px] top-24 h-80 w-80 rounded-full bg-indigo-200/14 blur-3xl"
        style={{ animation: "bubble2 8.6s ease-in-out infinite", animationDelay: "-1.8s" }}
      />
      <div
        className="absolute bottom-[-140px] left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-white/65 blur-3xl"
        style={{ animation: "bubble4 9s ease-in-out infinite", animationDelay: "-0.8s" }}
      />
      <div
        className="absolute left-[12%] top-[42%] h-20 w-20 rounded-full bg-orange-300/12 blur-2xl"
        style={{ animation: "bubble3 9.4s ease-in-out infinite", animationDelay: "-1.6s" }}
      />
      <div
        className="absolute right-[16%] top-[44%] h-16 w-16 rounded-full bg-white/45 blur-xl"
        style={{ animation: "bubble1 10s ease-in-out infinite", animationDelay: "-2s" }}
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

        <div className="grid overflow-hidden rounded-2xl border border-white/60 bg-white/55 shadow-[0_24px_80px_rgba(196,95,0,0.12)] backdrop-blur-md sm:rounded-3xl lg:grid-cols-[1.05fr_1fr] xl:grid-cols-[1.1fr_1fr]">
          <aside className="relative border-b border-orange-100/80 p-5 sm:p-8 lg:border-b-0 lg:border-r lg:p-10">
            <div className="mb-5 inline-flex max-w-full items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5 text-[10px] font-semibold tracking-[0.12em] text-orange-600 sm:mb-8 sm:px-4 sm:text-xs sm:tracking-[0.15em]">
              NEW WRITER ONBOARDING
            </div>
            <h1 className="mb-3 max-w-[20ch] text-3xl font-extrabold leading-[1.15] tracking-tight text-black sm:mb-4 sm:max-w-none sm:text-4xl lg:text-5xl">
              Create your reading identity
            </h1>
            <p className="mb-6 max-w-sm text-sm leading-relaxed text-black/65 sm:mb-8">
              Build your profile once, then discover stories, publish your voice, and track your reading journey in one place.
            </p>

            <div className="space-y-3 sm:space-y-4">
              <div className="rounded-2xl border border-orange-100 bg-white/80 p-3.5 sm:p-4">
                <p className="text-xs font-semibold tracking-wide text-orange-500">STEP 1</p>
                <p className="mt-1 text-sm text-black/70">Set your public name and username.</p>
              </div>
              <div className="rounded-2xl border border-orange-100 bg-white/80 p-3.5 sm:p-4">
                <p className="text-xs font-semibold tracking-wide text-orange-500">STEP 2</p>
                <p className="mt-1 text-sm text-black/70">Secure your account with a strong password.</p>
              </div>
              <div className="rounded-2xl border border-orange-100 bg-white/80 p-3.5 sm:p-4">
                <p className="text-xs font-semibold tracking-wide text-orange-500">STEP 3</p>
                <p className="mt-1 text-sm text-black/70">Start reading and writing with your new profile.</p>
              </div>
            </div>
          </aside>

          <div className="p-5 sm:p-8 md:p-10">
            <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-orange-500 sm:text-sm">SIGN UP</p>
            <h2 className="mb-5 text-2xl font-extrabold tracking-tight text-black sm:mb-6 sm:text-3xl md:text-4xl">
              Open your account
            </h2>

            <form className="space-y-4">
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-black/80">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="min-h-11 w-full rounded-xl border border-black/10 bg-white/80 px-4 py-3 text-base text-black placeholder:text-black/45 outline-none transition-colors duration-200 focus:border-orange-400 sm:min-h-0 sm:text-[15px]"
                />
              </div>

              <div className="space-y-3">
                <Drawer.Root>
                  <Drawer.Trigger asChild>
                    <button
                      type="button"
                      className="flex min-h-[3.25rem] w-full items-start justify-between gap-3 rounded-xl border border-black/10 bg-white/80 px-4 py-3 text-left transition-colors hover:border-orange-300 sm:min-h-0 sm:items-center"
                    >
                      <span>
                        <span className="block text-xs font-semibold tracking-wide text-black/45">PROFILE DETAILS</span>
                        <span className="block break-words text-sm leading-snug text-black/80">
                          {fullName && username ? `${fullName} (${username})` : "Add full name and username"}
                        </span>
                      </span>
                      <span className="shrink-0 text-sm font-semibold text-orange-500">Edit</span>
                    </button>
                  </Drawer.Trigger>
                  <Drawer.Portal>
                    <Drawer.Overlay className="fixed inset-0 z-60 bg-black/30" />
                    <Drawer.Content className="fixed bottom-0 left-0 right-0 z-70 mx-auto max-h-[90dvh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-white p-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-2xl outline-none sm:p-6">
                      <div className="mx-auto mb-4 h-1.5 w-14 rounded-full bg-zinc-300" />
                      <Drawer.Title className="text-xl font-bold text-zinc-950 sm:text-2xl">Profile details</Drawer.Title>
                      <Drawer.Description className="mb-5 mt-1 text-sm text-zinc-500">
                        Choose how readers will see your profile.
                      </Drawer.Description>
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="drawer-name" className="mb-2 block text-sm font-medium text-black/80">
                            Full name
                          </label>
                          <input
                            id="drawer-name"
                            type="text"
                            value={fullName}
                            onChange={(event) => setFullName(event.target.value)}
                            placeholder="Your full name"
                            className="min-h-11 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-base text-black placeholder:text-black/45 outline-none transition-colors duration-200 focus:border-orange-400 sm:min-h-0 sm:text-[15px]"
                          />
                        </div>
                        <div>
                          <label htmlFor="drawer-username" className="mb-2 block text-sm font-medium text-black/80">
                            Username
                          </label>
                          <input
                            id="drawer-username"
                            type="text"
                            value={username}
                            onChange={(event) => setUsername(event.target.value)}
                            placeholder="@yourname"
                            className="min-h-11 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-base text-black placeholder:text-black/45 outline-none transition-colors duration-200 focus:border-orange-400 sm:min-h-0 sm:text-[15px]"
                          />
                        </div>
                      </div>
                      <Drawer.Close asChild>
                        <button
                          type="button"
                          className="mt-6 min-h-12 w-full rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-500"
                        >
                          Save profile details
                        </button>
                      </Drawer.Close>
                    </Drawer.Content>
                  </Drawer.Portal>
                </Drawer.Root>

                <Drawer.Root>
                  <Drawer.Trigger asChild>
                    <button
                      type="button"
                      className="flex min-h-[3.25rem] w-full items-start justify-between gap-3 rounded-xl border border-black/10 bg-white/80 px-4 py-3 text-left transition-colors hover:border-orange-300 sm:min-h-0 sm:items-center"
                    >
                      <span>
                        <span className="block text-xs font-semibold tracking-wide text-black/45">PASSWORD SETUP</span>
                        <span className="block text-sm leading-snug text-black/80">
                          {password && confirmPassword ? "Password configured" : "Create and confirm your password"}
                        </span>
                      </span>
                      <span className="shrink-0 text-sm font-semibold text-orange-500">Edit</span>
                    </button>
                  </Drawer.Trigger>
                  <Drawer.Portal>
                    <Drawer.Overlay className="fixed inset-0 z-60 bg-black/30" />
                    <Drawer.Content className="fixed bottom-0 left-0 right-0 z-70 mx-auto max-h-[90dvh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-white p-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-2xl outline-none sm:p-6">
                      <div className="mx-auto mb-4 h-1.5 w-14 rounded-full bg-zinc-300" />
                      <Drawer.Title className="text-xl font-bold text-zinc-950 sm:text-2xl">Set password</Drawer.Title>
                      <Drawer.Description className="mb-5 mt-1 text-sm text-zinc-500">
                        Use at least 8 characters for better account security.
                      </Drawer.Description>
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="drawer-password" className="mb-2 block text-sm font-medium text-black/80">
                            Password
                          </label>
                          <div className="relative">
                            <input
                              id="drawer-password"
                              type={showPassword ? "text" : "password"}
                              value={password}
                              onChange={(event) => setPassword(event.target.value)}
                              placeholder="Create password"
                              className="min-h-11 w-full rounded-xl border border-black/10 bg-white px-4 py-3 pr-12 text-base text-black placeholder:text-black/45 outline-none transition-colors duration-200 focus:border-orange-400 sm:min-h-0 sm:text-[15px]"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword((prev) => !prev)}
                              aria-label={showPassword ? "Hide password" : "Show password"}
                              className="absolute inset-y-0 right-0 flex min-h-11 min-w-11 items-center justify-center text-black/50 transition-colors hover:text-black sm:min-h-0 sm:min-w-12"
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
                        <div>
                          <label
                            htmlFor="drawer-confirm-password"
                            className="mb-2 block text-sm font-medium text-black/80"
                          >
                            Confirm password
                          </label>
                          <div className="relative">
                            <input
                              id="drawer-confirm-password"
                              type={showConfirmPassword ? "text" : "password"}
                              value={confirmPassword}
                              onChange={(event) => setConfirmPassword(event.target.value)}
                              placeholder="Confirm password"
                              className="min-h-11 w-full rounded-xl border border-black/10 bg-white px-4 py-3 pr-12 text-base text-black placeholder:text-black/45 outline-none transition-colors duration-200 focus:border-orange-400 sm:min-h-0 sm:text-[15px]"
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword((prev) => !prev)}
                              aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                              className="absolute inset-y-0 right-0 flex min-h-11 min-w-11 items-center justify-center text-black/50 transition-colors hover:text-black sm:min-h-0 sm:min-w-12"
                            >
                              {showConfirmPassword ? (
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
                      </div>
                      <Drawer.Close asChild>
                        <button
                          type="button"
                          className="mt-6 min-h-12 w-full rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-500"
                        >
                          Save password
                        </button>
                      </Drawer.Close>
                    </Drawer.Content>
                  </Drawer.Portal>
                </Drawer.Root>
              </div>

              <label className="flex items-start gap-3 rounded-xl border border-orange-100 bg-orange-50/60 px-3 py-3 text-[11px] leading-relaxed text-black/70 sm:px-4 sm:text-xs">
                <input type="checkbox" className="mt-0.5 h-[18px] w-[18px] shrink-0 accent-orange-500 sm:h-4 sm:w-4" />
                <span>
                  I agree to the Terms and Privacy Policy, and I want updates about new features and writing programs.
                </span>
              </label>

              <button
                type="submit"
                className="min-h-12 w-full rounded-xl bg-black px-6 py-3 text-base font-semibold text-white transition-colors duration-300 hover:bg-orange-500"
              >
                Create account
              </button>
            </form>

            <div className="my-5 flex items-center gap-3 sm:my-6 sm:gap-4">
              <div className="h-px flex-1 bg-black/10" />
              <span className="text-xs tracking-wide text-black/50">or continue with</span>
              <div className="h-px flex-1 bg-black/10" />
            </div>

            <button
              type="button"
              className="inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-orange-50"
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

            <p className="mt-5 text-center text-sm leading-snug text-black/65 sm:mt-6">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-orange-500 hover:text-orange-600">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}