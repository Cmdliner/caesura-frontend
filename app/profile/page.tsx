"use client";

import Link from "next/link";
import { useState } from "react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "writing", label: "My writing" },
  { id: "reading", label: "Reading" },
] as const;

type TabId = (typeof tabs)[number]["id"];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  return (
    <>
      <Header />
      <main className="relative min-h-screen overflow-x-hidden bg-[#f6f8fc] pb-16 pt-[4.5rem] sm:pt-24">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-0 h-40 bg-linear-to-br from-orange-200/80 via-orange-100/60 to-amber-50 sm:h-48"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-0 h-40 bg-[linear-gradient(rgba(30,41,59,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(30,41,59,0.04)_1px,transparent_1px)] [background-size:24px_24px] opacity-60 sm:h-48"
          aria-hidden="true"
        />

        <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6">
          <nav className="mb-4 text-xs text-zinc-500 sm:mb-6 sm:text-sm" aria-label="Breadcrumb">
            <Link href="/" className="transition-colors hover:text-orange-600">
              Home
            </Link>
            <span className="mx-2 text-zinc-400" aria-hidden="true">
              /
            </span>
            <span className="font-medium text-zinc-700">Profile</span>
          </nav>

          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-end sm:gap-8">
            <div className="-mt-12 flex shrink-0 flex-col items-center sm:-mt-16 sm:items-start">
              <div
                className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-white bg-linear-to-br from-orange-400 to-orange-600 text-3xl font-bold text-white shadow-lg ring-1 ring-black/5 sm:h-32 sm:w-32 sm:text-4xl"
                aria-hidden="true"
              >
                AR
              </div>
            </div>

            <div className="w-full min-w-0 flex-1 text-center sm:pb-2 sm:text-left">
              <div className="flex flex-col items-center gap-1 sm:items-start">
                <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 sm:text-3xl">Alex Rivera</h1>
                <p className="text-sm font-medium text-orange-600">@alexwrites</p>
              </div>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-zinc-600 sm:mx-0">
                Fantasy &amp; literary fiction. I write about impossible libraries and the people who find them. Coffee,
                plot twists, and long walks between chapters.
              </p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <button
                  type="button"
                  className="rounded-full bg-zinc-900 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-500"
                >
                  Edit profile
                </button>
                <button
                  type="button"
                  className="rounded-full border border-zinc-200 bg-white px-5 py-2 text-sm font-semibold text-zinc-800 shadow-sm transition-colors hover:border-zinc-300 hover:bg-zinc-50"
                >
                  Share profile
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-2 rounded-2xl border border-zinc-200/80 bg-white/90 p-4 shadow-sm backdrop-blur-sm sm:gap-4 sm:p-5">
            <div className="text-center">
              <p className="text-lg font-bold tabular-nums text-zinc-900 sm:text-2xl">12</p>
              <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-500 sm:text-xs">Stories</p>
            </div>
            <div className="border-x border-zinc-100 text-center">
              <p className="text-lg font-bold tabular-nums text-zinc-900 sm:text-2xl">2.4k</p>
              <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-500 sm:text-xs">Reads</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold tabular-nums text-zinc-900 sm:text-2xl">892</p>
              <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-500 sm:text-xs">Followers</p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div
              className="flex w-full gap-1 rounded-xl border border-zinc-200 bg-white p-1 shadow-sm sm:w-auto"
              role="tablist"
              aria-label="Profile sections"
            >
              {tabs.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`min-h-10 flex-1 rounded-lg px-3 py-2 text-center text-sm font-semibold transition-colors sm:min-h-0 sm:flex-none sm:px-4 ${
                    activeTab === t.id
                      ? "bg-zinc-900 text-white"
                      : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap justify-center gap-2 sm:justify-end">
              <Link
                href="/library"
                className="text-sm font-semibold text-orange-600 underline-offset-4 hover:underline"
              >
                My library
              </Link>
              <span className="hidden text-zinc-300 sm:inline" aria-hidden="true">
                ·
              </span>
              <Link
                href="/create-story"
                className="text-sm font-semibold text-orange-600 underline-offset-4 hover:underline"
              >
                New story
              </Link>
            </div>
          </div>

          <div className="mt-6 min-h-[280px]">
            {activeTab === "overview" && (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Link
                  href="/library"
                  className="group rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-all hover:border-orange-200 hover:shadow-md"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-orange-500">Library</p>
                  <p className="mt-2 font-semibold text-zinc-900">Continue reading</p>
                  <p className="mt-1 text-sm text-zinc-500">Pick up where you left off.</p>
                  <span className="mt-3 inline-block text-sm font-semibold text-orange-600 group-hover:underline">
                    Open library →
                  </span>
                </Link>
                <Link
                  href="/create-story"
                  className="group rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-all hover:border-orange-200 hover:shadow-md"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-orange-500">Write</p>
                  <p className="mt-2 font-semibold text-zinc-900">Start a new draft</p>
                  <p className="mt-1 text-sm text-zinc-500">Blank page, full possibility.</p>
                  <span className="mt-3 inline-block text-sm font-semibold text-orange-600 group-hover:underline">
                    Create story →
                  </span>
                </Link>
                <div className="rounded-2xl border border-dashed border-zinc-200 bg-white/60 p-5 sm:col-span-2 lg:col-span-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Activity</p>
                  <p className="mt-2 text-sm text-zinc-600">
                    Recent likes, comments, and milestones will show here once you&apos;re active on Caesura.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "writing" && (
              <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-zinc-900">Published &amp; drafts</h2>
                    <p className="text-sm text-zinc-500">Manage your stories from one place.</p>
                  </div>
                  <Link
                    href="/create-story"
                    className="inline-flex min-h-11 items-center justify-center rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-zinc-900"
                  >
                    New story
                  </Link>
                </div>
                <ul className="mt-6 divide-y divide-zinc-100">
                  {[
                    { title: "The Midnight Shelf", status: "Published", reads: "1.2k" },
                    { title: "Letters Never Sent", status: "Draft", reads: "—" },
                    { title: "Winter in the Stacks", status: "Draft", reads: "—" },
                  ].map((story) => (
                    <li key={story.title} className="flex flex-col gap-2 py-4 first:pt-0 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-medium text-zinc-900">{story.title}</p>
                        <p className="text-xs text-zinc-500">
                          {story.status}
                          {story.reads !== "—" && ` · ${story.reads} reads`}
                        </p>
                      </div>
                      <button
                        type="button"
                        className="w-fit text-sm font-semibold text-orange-600 hover:underline"
                      >
                        Open
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === "reading" && (
              <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold text-zinc-900">Reading list</h2>
                <p className="mt-1 text-sm text-zinc-500">Stories you&apos;ve saved for later.</p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {["The Last Archive", "Salt & Starlight", "Paper Boats"].map((title) => (
                    <div
                      key={title}
                      className="flex items-center justify-between gap-3 rounded-xl border border-zinc-100 bg-zinc-50/80 px-4 py-3"
                    >
                      <span className="min-w-0 truncate text-sm font-medium text-zinc-800">{title}</span>
                      <button type="button" className="shrink-0 text-xs font-semibold text-orange-600 hover:underline">
                        Read
                      </button>
                    </div>
                  ))}
                </div>
                <Link
                  href="/library"
                  className="mt-6 inline-flex text-sm font-semibold text-orange-600 hover:underline"
                >
                  View full library →
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
