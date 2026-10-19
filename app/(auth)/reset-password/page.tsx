"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { CircleCheck, LinkIcon } from "lucide-react";
import AuthBackdrop from "@/components/auth/auth-backdrop";
import { PasswordInput } from "@/components/auth/fields";
import { useAuthMutation } from "@/lib/api/queries";
import { getErrorMessage } from "@/lib/utils";

/** Mirrors the backend rules so users get instant feedback instead of a 422. */
function validatePassword(password: string): string | null {
  if (password.length < 8) return "Password must be at least 8 characters.";
  if (password.length > 72) return "Password must not exceed 72 characters.";
  if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter.";
  if (!/[a-z]/.test(password)) return "Password must contain at least one lowercase letter.";
  if (!/[0-9]/.test(password)) return "Password must contain at least one number.";
  return null;
}

function ResetPasswordForm() {
  const token = useSearchParams().get("token") ?? "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  // Server message kept only to explain a dead link on the full-page state.
  const [deadReason, setDeadReason] = useState("");
  const [done, setDone] = useState(false);
  // Set when the server says the link is dead, so we can offer a fresh one.
  const [linkDead, setLinkDead] = useState(false);

  const { mutate: resetPassword, isPending } = useAuthMutation.useResetPassword({
    onSuccess: () => {
      toast.success("Password updated");
      setDone(true);
    },
    onError: (err: unknown) => {
      const message = getErrorMessage(err);
      if (/invalid or has expired/i.test(message)) {
        setDeadReason(message);
        setLinkDead(true);
      } else {
        toast.error("Couldn't update your password", { description: message });
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const problem = validatePassword(password);
    if (problem) return void toast.error(problem);
    if (password !== confirm) return void toast.error("Passwords do not match");
    resetPassword({ token, password });
  };

  if (done) {
    return (
      <div className="text-center">
        <span className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-green-700">
          <CircleCheck className="h-7 w-7" strokeWidth={1.6} />
        </span>
        <h1 className="mb-2 text-2xl font-extrabold tracking-tight text-zinc-900 sm:text-3xl">Password updated</h1>
        <p className="text-sm leading-relaxed text-zinc-600">Your password has been changed. You can now sign in with it.</p>
        <Link href="/login" className="btn btn-dark btn-lg mt-6 w-full">
          Continue to sign in
        </Link>
      </div>
    );
  }

  if (!token || linkDead) {
    return (
      <div className="text-center">
        <span className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-600">
          <LinkIcon className="h-7 w-7" strokeWidth={1.6} />
        </span>
        <h1 className="mb-2 text-2xl font-extrabold tracking-tight text-zinc-900 sm:text-3xl">This link won&apos;t work</h1>
        <p className="text-sm leading-relaxed text-zinc-600">
          {token ? deadReason || "This reset link is invalid or has expired." : "This reset link is missing its token."} Reset
          links work once and expire after 1 hour.
        </p>
        <Link href="/forgot-password" className="btn btn-primary btn-lg mt-6 w-full">
          Request a new link
        </Link>
        <Link href="/login" className="mt-4 inline-block text-sm font-medium text-zinc-600 hover:text-zinc-950">
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <>
      <p className="eyebrow mb-2 text-center">Account recovery</p>
      <h1 className="mb-2 text-center text-2xl font-extrabold tracking-tight text-zinc-900 sm:text-3xl md:text-4xl">
        Set a new password
      </h1>
      <p className="mb-6 text-center text-sm leading-relaxed text-zinc-500 sm:mb-8">
        Choose a strong password you don&apos;t use anywhere else.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="password" className="mb-2 block text-sm font-medium text-zinc-700">
            New password
          </label>
          <PasswordInput
            id="password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isPending}
          />
          <p className="mt-2 text-xs text-zinc-500">Use 8+ characters with an uppercase letter, a lowercase letter and a number.</p>
        </div>
        <div>
          <label htmlFor="confirm" className="mb-2 block text-sm font-medium text-zinc-700">
            Confirm password
          </label>
          <PasswordInput
            id="confirm"
            autoComplete="new-password"
            placeholder="Repeat your new password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            disabled={isPending}
          />
        </div>

        <button type="submit" disabled={isPending} className="btn btn-dark btn-lg w-full">
          {isPending ? "Updating..." : "Update password"}
        </button>
      </form>
    </>
  );
}

export default function ResetPassword() {
  return (
    <AuthBackdrop>
      <div className="mx-auto w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-5 sm:p-8 md:p-10">
        {/* useSearchParams needs a Suspense boundary in the App Router */}
        <Suspense fallback={<div className="skeleton h-64 rounded-xl" />}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </AuthBackdrop>
  );
}
