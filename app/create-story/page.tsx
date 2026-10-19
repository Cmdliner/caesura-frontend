"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, BookOpen, CircleCheck, Loader2, Plus, X } from "lucide-react";
import PageHero from "@/components/ui/page-hero";
import { Splash } from "@/components/ui/patterns";
import { PageLoader } from "@/components/ui/empty-state";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AppNav from "@/components/layout/app-nav";
import { booksAPI } from "@/lib/api/books";
import { useAuth } from "@/app/providers/auth-provider";

export default function CreateStoryPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [step, setStep] = useState<"create" | "done">("create");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [authors, setAuthors] = useState<string[]>([]);
  const [authorInput, setAuthorInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [createdBook, setCreatedBook] = useState<API.CreateBookResponse | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push("/login");
  }, [isAuthenticated, authLoading, router]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = "Story title is required";
    if (description.length > 500) newErrors.description = "Keep it under 500 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const book = await booksAPI.createBook({
        title: title.trim(),
        description: description.trim() || undefined,
        language: "en",
        authors: authors.length > 0 ? authors : undefined,
      });
      setCreatedBook(book);
      setStep("done");
    } catch (error: any) {
      toast.error("Couldn't create your story", {
        description: error?.response?.data?.error || error?.message || "Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAuthor = () => {
    const trimmed = authorInput.trim();
    if (trimmed && !authors.includes(trimmed)) {
      setAuthors([...authors, trimmed]);
      setAuthorInput("");
    }
  };

  const handleRemoveAuthor = (index: number) => {
    setAuthors(authors.filter((_, i) => i !== index));
  };

  if (authLoading) {
    return <PageLoader fullPage label="Loading…" />;
  }

  const shownTitle = title.trim() || "Your story title";

  return (
    <>
      <AppNav />
      <main className="min-h-screen bg-zinc-50 pb-20 pt-[60px] page-enter">
        <PageHero
          compact
          title={step === "create" ? "Start a new story" : "Story created"}
          description={step === "create" ? "Set up the basics. You can edit them later." : undefined}
          containerClassName="mx-auto max-w-5xl px-4 sm:px-6"
          actions={
            <Link href="/write" className="btn btn-outline btn-md">
              <ArrowLeft className="h-4 w-4" />
              Back to writing
            </Link>
          }
        />

        <div className="mx-auto max-w-5xl px-4 pt-8 sm:px-6">
          {step === "create" ? (
            <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_19rem]">
              {/* Form */}
              <form onSubmit={handleCreateBook} className="card space-y-7 p-6 sm:p-8">
                <div>
                  <label htmlFor="title" className="mb-2 block text-sm font-semibold text-zinc-800">
                    Title <span className="text-brand-700">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      if (errors.title) setErrors((prev) => ({ ...prev, title: "" }));
                    }}
                    placeholder="Give your story a title…"
                    className={`field !text-base font-medium ${errors.title ? "!border-red-400" : ""}`}
                    disabled={isLoading}
                    autoFocus
                  />
                  {errors.title && <p className="mt-1.5 text-xs text-red-600">{errors.title}</p>}
                </div>

                <div>
                  <div className="mb-2 flex items-baseline justify-between">
                    <label htmlFor="description" className="text-sm font-semibold text-zinc-800">
                      Description <span className="ml-1 text-xs font-normal text-zinc-500">(optional)</span>
                    </label>
                    <span className={`text-xs tabular-nums ${description.length > 480 ? "text-red-600" : "text-zinc-400"}`}>{description.length}/500</span>
                  </div>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="A short summary of what your story is about…"
                    rows={5}
                    className={`field resize-none leading-relaxed ${errors.description ? "!border-red-400" : ""}`}
                    disabled={isLoading}
                  />
                  {errors.description && <p className="mt-1.5 text-xs text-red-600">{errors.description}</p>}
                </div>

                <div>
                  <label htmlFor="coauthor" className="mb-2 block text-sm font-semibold text-zinc-800">
                    Co-authors <span className="ml-1 text-xs font-normal text-zinc-500">(optional)</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="coauthor"
                      type="text"
                      value={authorInput}
                      onChange={(e) => setAuthorInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddAuthor();
                        }
                      }}
                      placeholder="Name, then press Enter…"
                      className="field"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={handleAddAuthor}
                      disabled={isLoading || !authorInput.trim()}
                      className="btn btn-outline btn-md flex-shrink-0"
                    >
                      <Plus className="h-4 w-4" />
                      Add
                    </button>
                  </div>
                  {authors.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {authors.map((author, index) => (
                        <span key={index} className="badge badge-brand !py-1.5 pl-3 pr-1.5">
                          {author}
                          <button
                            type="button"
                            onClick={() => handleRemoveAuthor(index)}
                            aria-label={`Remove ${author}`}
                            className="flex h-5 w-5 items-center justify-center rounded-full transition-colors hover:bg-brand-200"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3 border-t border-zinc-100 pt-6">
                  <button type="submit" disabled={isLoading} className="btn btn-primary btn-lg">
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Creating…
                      </>
                    ) : (
                      <>
                        Create story
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                  <Link href="/write" className="btn btn-outline btn-lg">
                    Cancel
                  </Link>
                </div>
              </form>

              {/* Live preview + what's next */}
              <aside className="space-y-4 lg:sticky lg:top-24">
                <div className="card p-5">
                  <p className="eyebrow mb-4">Preview</p>
                  <div className="mx-auto w-40">
                    <div className="relative flex aspect-[2/3] flex-col items-center justify-center overflow-hidden rounded-xl bg-brand-100 px-4 text-center shadow-[0_8px_24px_rgba(0,0,0,0.14)] ring-1 ring-black/5">
                      <span className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-brand-200/70" />
                      <span className="absolute -bottom-8 -left-6 h-24 w-24 rounded-full bg-brand-200/70" />
                      <span className={`relative line-clamp-5 font-brand text-xl font-black leading-tight ${title.trim() ? "text-brand-700" : "text-brand-700/50"}`}>
                        {shownTitle}
                      </span>
                    </div>
                  </div>
                  <p className="mt-4 line-clamp-2 text-center text-xs leading-relaxed text-zinc-500">
                    {description.trim() || "Your description appears here."}
                  </p>
                </div>

                <div className="card p-5">
                  <p className="eyebrow mb-3">What happens next</p>
                  <ol className="space-y-3 text-sm text-zinc-700">
                    {["Your story is created as a draft", "Write chapters one by one, each with its own title", "Publish when you're ready for readers"].map((t, i) => (
                      <li key={t} className="flex items-start gap-3">
                        <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-zinc-950 text-xs font-bold text-white">{i + 1}</span>
                        <span className="pt-0.5 leading-snug">{t}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </aside>
            </div>
          ) : createdBook ? (
            <div className="card relative mx-auto max-w-2xl overflow-hidden px-6 py-14 text-center sm:px-12">
              <Splash variant="a" className="-right-16 -top-24 h-64 w-64 text-brand-100" />
              <span className="relative mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 text-green-700">
                <CircleCheck className="h-8 w-8" strokeWidth={1.6} />
              </span>
              <p className="eyebrow relative mb-2">Story created</p>
              <h2 className="relative font-brand text-4xl font-black leading-tight text-zinc-950">{createdBook.title}</h2>
              <p className="relative mx-auto mt-3 max-w-md text-zinc-600">Your story is ready. Write your first chapter to bring it to life.</p>
              <div className="relative mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Link href={`/write/${createdBook.slug}/chapter/new`} className="btn btn-primary btn-lg">
                  <Plus className="h-4 w-4" />
                  Write first chapter
                </Link>
                <Link href={`/write/${createdBook.slug}`} className="btn btn-outline btn-lg">
                  <BookOpen className="h-4 w-4" />
                  Story dashboard
                </Link>
              </div>
            </div>
          ) : null}
        </div>
      </main>
    </>
  );
}
