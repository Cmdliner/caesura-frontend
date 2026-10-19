"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuthMutation } from "@/lib/api/queries";
import { useAuth } from "@/app/providers/auth-provider";
import { getErrorMessage } from "@/lib/utils";
import AuthBackdrop from "@/components/auth/auth-backdrop";
import { FormDivider, GoogleButton, PasswordInput } from "@/components/auth/fields";

export default function Login() {
  const router = useRouter();
  const { isAuthenticated, setUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { mutate: login, isPending } = useAuthMutation.useLogin({
    onSuccess: (data) => {
      setUser(data.user);
      toast.success("Welcome back!");
      router.push("/library");
    },
    onError: (error) => {
      toast.error("Couldn't sign you in", { description: getErrorMessage(error) });
    },
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/library");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    login({ email, password });
  };

  return (
    <AuthBackdrop>
        <div className="mx-auto w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-5 sm:p-8 md:p-10">
          <p className="eyebrow mb-2 text-center">Welcome back</p>
          <h1 className="mb-2 text-center text-2xl font-extrabold tracking-tight text-zinc-900 sm:text-3xl md:text-4xl">
            Sign in
          </h1>
          <p className="mb-6 text-center text-sm leading-relaxed text-zinc-500 sm:mb-8">
            Enter your email to continue to your library and drafts.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
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

            <div>
              <div className="mb-2 flex items-center justify-between gap-2">
                <label htmlFor="password" className="block text-sm font-medium text-zinc-700">
                  Password
                </label>
                <Link href="/forgot-password" className="text-xs font-medium text-orange-700 transition-colors hover:text-orange-800">
                  Forgot password?
                </Link>
              </div>
              <PasswordInput
                id="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isPending}
              />
            </div>

            <button type="submit" disabled={isPending} className="btn btn-dark btn-lg mt-1 w-full">
              {isPending ? "Signing in..." : "Continue"}
            </button>
          </form>

          <FormDivider />
          <GoogleButton disabled={isPending} />

          <p className="mt-5 text-center text-sm leading-snug text-zinc-600 sm:mt-6">
            New to Caesura?{" "}
            <Link href="/signup" className="font-semibold text-orange-700 hover:text-orange-800">
              Create an account
            </Link>
          </p>
        </div>
    </AuthBackdrop>
  );
}
