"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AppHeader from "@/components/layout/app-header";
import { booksAPI } from "@/lib/api/books";

export default function CreateStoryPage() {
  const router = useRouter();
  const [step, setStep] = useState<"create" | "chapters">("create");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [authors, setAuthors] = useState<string[]>([]);
  const [authorInput, setAuthorInput] = useState("");
  const [genreIds, setGenreIds] = useState<number[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [createdBook, setCreatedBook] = useState<API.BookDetail | null>(null);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = "Story title is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateBook = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const book = await booksAPI.createBook({
        title: title.trim(),
        description: description.trim() || undefined,
        language: "en",
        authors: authors.length > 0 ? authors : undefined,
        genre_ids: genreIds.length > 0 ? genreIds : undefined,
      });
      setCreatedBook(book);
      setStep("chapters");
    } catch (error: any) {
      setErrors({
        submit:
          error?.response?.data?.message ||
          error?.message ||
          "Failed to create story",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAuthor = () => {
    const trimmedAuthor = authorInput.trim();
    if (trimmedAuthor && !authors.includes(trimmedAuthor)) {
      setAuthors([...authors, trimmedAuthor]);
      setAuthorInput("");
    }
  };

  const handleRemoveAuthor = (index: number) => {
    setAuthors(authors.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-zinc-50">
      <AppHeader showBackButton onBack={() => router.back()} />

      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          {step === "create" ? (
            <>
              {/* Page Header */}
              <div className="mb-8">
                <Link
                  href="/profile"
                  className="text-sm text-zinc-500 hover:text-orange-600 transition-colors mb-4 inline-flex items-center gap-1"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  Back to Profile
                </Link>

                <h1 className="text-4xl font-extrabold text-zinc-900 sm:text-5xl">
                  Create a New Story
                </h1>
                <p className="mt-2 text-lg text-zinc-600">
                  Start your writing journey. You'll add chapters after creating your story.
                </p>
              </div>

              {/* Error Messages */}
              {errors.submit && (
                <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4">
                  <p className="text-sm text-red-700">{errors.submit}</p>
                </div>
              )}

              {/* Story Info Form */}
              <form onSubmit={handleCreateBook} className="space-y-8 max-w-2xl">
                {/* Title Section */}
                <div className="space-y-3">
                  <label
                    htmlFor="title"
                    className="block text-sm font-semibold text-zinc-900"
                  >
                    Story Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      if (errors.title) {
                        setErrors((prev) => ({ ...prev, title: "" }));
                      }
                    }}
                    placeholder="Enter your story title..."
                    className={`w-full px-4 py-3 rounded-lg border text-lg font-medium transition-colors ${
                      errors.title
                        ? "border-red-300 bg-red-50 focus:border-red-400 focus:ring-1 focus:ring-red-100"
                        : "border-zinc-200 bg-white focus:border-orange-400 focus:ring-1 focus:ring-orange-100"
                    } focus:outline-none`}
                    disabled={isLoading}
                  />
                  {errors.title && (
                    <p className="text-sm text-red-600">{errors.title}</p>
                  )}
                </div>

                {/* Description Section */}
                <div className="space-y-3">
                  <label
                    htmlFor="description"
                    className="block text-sm font-semibold text-zinc-900"
                  >
                    Description (Optional)
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="A brief summary of your story... What readers should know before diving in."
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-zinc-200 bg-white text-sm transition-colors focus:border-orange-400 focus:ring-1 focus:ring-orange-100 focus:outline-none resize-none"
                    disabled={isLoading}
                  />
                  <p className="text-xs text-zinc-500">
                    {description.length}/500 characters
                  </p>
                </div>

                {/* Authors Section */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-zinc-900">
                    Additional Authors (Optional)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={authorInput}
                      onChange={(e) => setAuthorInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddAuthor();
                        }
                      }}
                      placeholder="Enter author name and press Enter..."
                      className="flex-1 px-4 py-3 rounded-lg border border-zinc-200 bg-white text-sm transition-colors focus:border-orange-400 focus:ring-1 focus:ring-orange-100 focus:outline-none"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={handleAddAuthor}
                      className="px-4 py-3 rounded-lg bg-zinc-100 text-zinc-700 text-sm font-semibold hover:bg-zinc-200 transition-colors disabled:opacity-50"
                      disabled={isLoading || !authorInput.trim()}
                    >
                      Add
                    </button>
                  </div>
                  {authors.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {authors.map((author, index) => (
                        <div
                          key={index}
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-100 text-orange-700 text-sm font-medium"
                        >
                          {author}
                          <button
                            type="button"
                            onClick={() => handleRemoveAuthor(index)}
                            className="ml-1 hover:text-orange-900 transition-colors"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-zinc-500">
                    Add co-authors or collaborators to your story. You can add up to 5 authors.
                  </p>
                </div>
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                  <div className="flex gap-3">
                    <svg
                      className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zm-11-1a1 1 0 11-2 0 1 1 0 012 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div>
                      <p className="font-medium text-blue-900">Chapter-based writing</p>
                      <p className="text-sm text-blue-700 mt-1">
                        After creating your story, you'll add chapters one by one. Each chapter can have
                        its own title and rich formatted content.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-3 rounded-lg bg-orange-500 text-white font-semibold hover:bg-orange-600 disabled:bg-zinc-300 disabled:cursor-not-allowed transition-colors"
                  >
                    {isLoading ? "Creating..." : "Create Story"}
                  </button>
                  <Link
                    href="/profile"
                    className="px-6 py-3 rounded-lg border border-zinc-200 bg-white text-zinc-900 font-semibold hover:bg-zinc-50 transition-colors"
                  >
                    Cancel
                  </Link>
                </div>
              </form>
            </>
          ) : createdBook ? (
            <>
              {/* Story Created - Chapters Step */}
              <div className="mb-8">
                <button
                  onClick={() => setStep("create")}
                  className="text-sm text-zinc-500 hover:text-orange-600 transition-colors mb-4 inline-flex items-center gap-1"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  Back to Story Info
                </button>

                <h1 className="text-4xl font-extrabold text-zinc-900 sm:text-5xl">
                  {createdBook.title}
                </h1>
                {createdBook.description && (
                  <p className="mt-2 text-lg text-zinc-600">
                    {createdBook.description}
                  </p>
                )}
              </div>

              {/* Success Message */}
              <div className="mb-8 rounded-lg border border-green-200 bg-green-50 p-4">
                <div className="flex gap-3">
                  <svg
                    className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <p className="font-medium text-green-900">
                      Story created successfully!
                    </p>
                    <p className="text-sm text-green-700 mt-1">
                      Now you can start adding chapters to your story.
                    </p>
                  </div>
                </div>
              </div>

              {/* Chapters Section */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-zinc-900 mb-4">
                    Chapters ({createdBook.chapters?.length || 0})
                  </h2>

                  {createdBook.chapters && createdBook.chapters.length > 0 ? (
                    <div className="space-y-3">
                      {createdBook.chapters.map((chapter) => (
                        <div
                          key={chapter.id}
                          className="flex items-center justify-between p-4 rounded-lg border border-zinc-200 hover:border-orange-300 transition-colors"
                        >
                          <div>
                            <p className="font-semibold text-zinc-900">
                              Chapter {chapter.chapter_number}: {chapter.title || "Untitled"}
                            </p>
                            <p className="text-sm text-zinc-600 mt-1">
                              {chapter.word_count || 0} words
                            </p>
                          </div>
                          <Link
                            href={`/write/${createdBook.id}/chapter/${chapter.chapter_number}`}
                            className="px-4 py-2 rounded-lg bg-orange-100 text-orange-600 font-medium hover:bg-orange-200 transition-colors"
                          >
                            Edit
                          </Link>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-zinc-600 mb-4">
                      No chapters yet. Create your first one to start writing!
                    </p>
                  )}
                </div>

                {/* Add Chapter Button */}
                <Link
                  href={`/write/${createdBook.slug}/chapters`}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-colors"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Add New Chapter
                </Link>
              </div>

              {/* Navigation */}
              <div className="mt-8 flex gap-3">
                <Link
                  href="/profile"
                  className="px-6 py-3 rounded-lg border border-zinc-200 bg-white text-zinc-900 font-semibold hover:bg-zinc-50 transition-colors"
                >
                  Go to Profile
                </Link>
              </div>
            </>
          ) : null}
        </div>
      </main>
    </div>
  );
}
