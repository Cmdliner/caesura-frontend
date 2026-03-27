"use client";   
import Link from "next/link";
import Header from "@/components/layout/header";

export default function NotFound() {
    return (
        <>
            <Header />
            <main className="flex flex-1 min-h-0 h-[100dvh] flex-col items-center justify-center bg-white px-4 pt-24 pb-4 md:px-8">
                <div className="max-w-xl w-full flex flex-col items-center text-center">
                    <img
                        src="/not-found.svg"
                        alt="Page not found illustration"
                        className="w-64 max-w-full mb-6 drop-shadow-xl select-none"
                        draggable="false"
                    />
                    <h1 className="text-3xl md:text-4xl font-black font-brand text-zinc-950 mb-2 tracking-tight">Page Not Found</h1>
                    <p className="text-base text-zinc-600 mb-6">
                        Sorry, we couldn’t find the page you’re looking for.<br />
                        It may have been moved, deleted, or never existed.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
                        <Link
                            href="/"
                            className="px-6 py-3 bg-orange-500 text-white font-semibold rounded-full hover:bg-black transition-colors duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-base"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            Back to Home
                        </Link>
                        <Link
                            href="/library"
                            className="px-6 py-3 border-2 border-zinc-950 text-zinc-950 font-semibold rounded-full hover:bg-zinc-950 hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-base"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            Go to Library
                        </Link>
                    </div>
                </div>
            </main>
        </>
    );
}