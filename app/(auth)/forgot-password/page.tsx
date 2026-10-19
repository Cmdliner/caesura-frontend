"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, MailCheck } from "lucide-react";
import AuthBackdrop from "@/components/auth/auth-backdrop";
import { useAuthMutation } from "@/lib/api/queries";
import { getErrorMessage } from "@/lib/utils";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sentTo, setSentTo] = useState<string | null>(null);

  const { mutate: requestReset, isPending } = useAuthMutation.useForgotPassword({
    onSuccess: (_data: unknown, variables: { email: string }) => {
      setSentTo(variables.email);
    },
    onError: (err: unknown) => toast.error("Couldn't send the reset link", { description: getErrorMessage(err) }),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      toast.error("Please enter your email address");
      return;
    }
    requestReset({ email: trimmed });
  };

  return (
    <AuthBackdrop>
      <div className="mx-auto w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-5 sm:p-8 md:p-10">
        {sentTo ? (
          <div className="text-center">
            <span className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-100 text-brand-700">
              <MailCheck className="h-7 w-7" strokeWidth={1.6} />
            </span>
            <h1 className="mb-2 text-2xl font-extrabold tracking-tight text-zinc-900 sm:text-3xl">Check your email</h1>
            <p className="text-sm leading-relaxed text-zinc-600">
              If an account exists for <span className="font-semibold text-zinc-900">{sentTo}</span>, we&apos;ve sent a
              link to reset your password. It expires in 1 hour.
            </p>
            <p className="mt-4 text-xs leading-relaxed text-zinc-500">
              Nothing in your inbox? Check your spam folder, or try again in a minute.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <Link href="/login" className="btn btn-dark btn-lg w-full">
                Back to sign in
              </Link>
              <button type="button" onClick={() => setSentTo(null)} className="text-sm font-medium text-orange-700 hover:text-orange-800">
                Use a different email
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="eyebrow mb-2 text-center">Account recovery</p>
            <h1 className="mb-2 text-center text-2xl font-extrabold tracking-tight text-zinc-900 sm:text-3xl md:text-4xl">
              Forgot password?
            </h1>
            <p className="mb-6 text-center text-sm leading-relaxed text-zinc-500 sm:mb-8">
              Enter the email you signed up with and we&apos;ll send you a link to reset your password.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-zinc-700">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isPending}
                  className="field"
                />
              </div>

              <button type="submit" disabled={isPending} className="btn btn-dark btn-lg w-full">
                {isPending ? "Sending..." : "Send reset link"}
              </button>
            </form>

            <Link
              href="/login"
              className="mt-6 flex items-center justify-center gap-1.5 text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-950"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to sign in
            </Link>
          </>
        )}
      </div>
    </AuthBackdrop>
  );
}
