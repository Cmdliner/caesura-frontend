"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Drawer } from "vaul";
import { useAuthMutation } from "@/lib/api/queries";
import AuthBackdrop from "@/components/auth/auth-backdrop";
import { FormDivider, GoogleButton, PasswordInput } from "@/components/auth/fields";

const steps = [
  "Set your public name and username.",
  "Secure your account with a strong password.",
  "Start reading and writing with your new profile.",
];

export default function SignUp() {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const registerMutation = useAuthMutation.useRegister();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !username || !password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      await registerMutation.mutateAsync({ email, username, password });
      toast.success("Account created!", { description: "Taking you to your library…" });
      setTimeout(() => {
        window.location.href = "/library";
      }, 1200);
    } catch (err: any) {
      toast.error("Couldn't create your account", { description: err?.message || "Please try again." });
    }
  };

  return (
    <AuthBackdrop maxWidth="max-w-5xl">
        <div className="grid overflow-hidden rounded-2xl border border-zinc-200 bg-white sm:rounded-3xl lg:grid-cols-[1.05fr_1fr] xl:grid-cols-[1.1fr_1fr]">
          <aside className="border-b border-zinc-200 bg-zinc-50/60 p-5 sm:p-8 lg:border-b-0 lg:border-r lg:p-10">
            <p className="eyebrow mb-5 sm:mb-8">New writer onboarding</p>
            <h1 className="mb-3 max-w-[20ch] text-3xl font-extrabold leading-[1.15] tracking-tight text-black sm:mb-4 sm:max-w-none sm:text-4xl lg:text-5xl">
              Create your reading identity
            </h1>
            <p className="mb-6 max-w-sm text-sm leading-relaxed text-zinc-600 sm:mb-8">
              Build your profile once, then discover stories, publish your voice, and track your reading journey in one place.
            </p>

            <div className="space-y-3 sm:space-y-4">
              {steps.map((step, i) => (
                <div key={step} className="rounded-2xl border border-zinc-200 bg-white p-3.5 sm:p-4">
                  <p className="text-xs font-semibold tracking-wide text-orange-700">STEP {i + 1}</p>
                  <p className="mt-1 text-sm text-zinc-700">{step}</p>
                </div>
              ))}
            </div>
          </aside>

          <div className="p-5 sm:p-8 md:p-10">
            <p className="eyebrow mb-2">Sign up</p>
            <h2 className="mb-5 text-2xl font-extrabold tracking-tight text-black sm:mb-6 sm:text-3xl md:text-4xl">
              Open your account
            </h2>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-zinc-700">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="field"
                />
              </div>

              <div className="space-y-3">
                <DetailRow
                  label="Profile details"
                  summary={fullName && username ? `${fullName} (${username})` : "Add full name and username"}
                  title="Profile details"
                  description="Choose how readers will see your profile."
                  saveLabel="Save profile details"
                >
                  <div>
                    <label htmlFor="drawer-name" className="mb-2 block text-sm font-medium text-zinc-700">
                      Full name
                    </label>
                    <input
                      id="drawer-name"
                      type="text"
                      autoComplete="name"
                      value={fullName}
                      onChange={(event) => setFullName(event.target.value)}
                      placeholder="Your full name"
                      className="field"
                    />
                  </div>
                  <div>
                    <label htmlFor="drawer-username" className="mb-2 block text-sm font-medium text-zinc-700">
                      Username
                    </label>
                    <input
                      id="drawer-username"
                      type="text"
                      autoComplete="username"
                      value={username}
                      onChange={(event) => setUsername(event.target.value)}
                      placeholder="@yourname"
                      className="field"
                    />
                  </div>
                </DetailRow>

                <DetailRow
                  label="Password setup"
                  summary={password && confirmPassword ? "Password configured" : "Create and confirm your password"}
                  title="Set password"
                  description="Use at least 8 characters for better account security."
                  saveLabel="Save password"
                >
                  <div>
                    <label htmlFor="drawer-password" className="mb-2 block text-sm font-medium text-zinc-700">
                      Password
                    </label>
                    <PasswordInput
                      id="drawer-password"
                      autoComplete="new-password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Create password"
                    />
                  </div>
                  <div>
                    <label htmlFor="drawer-confirm-password" className="mb-2 block text-sm font-medium text-zinc-700">
                      Confirm password
                    </label>
                    <PasswordInput
                      id="drawer-confirm-password"
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      placeholder="Confirm password"
                    />
                  </div>
                </DetailRow>
              </div>

              <label className="flex items-start gap-3 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-3 text-[11px] leading-relaxed text-zinc-600 sm:px-4 sm:text-xs">
                <input type="checkbox" className="mt-0.5 h-[18px] w-[18px] shrink-0 accent-orange-600 sm:h-4 sm:w-4" />
                <span>
                  I agree to the Terms and Privacy Policy, and I want updates about new features and writing programs.
                </span>
              </label>

              <button type="submit" disabled={registerMutation.isPending} className="btn btn-dark btn-lg w-full">
                {registerMutation.isPending ? "Creating..." : "Create account"}
              </button>
            </form>

            <FormDivider label="or continue with" />
            <GoogleButton disabled={registerMutation.isPending} />

            <p className="mt-5 text-center text-sm leading-snug text-zinc-600 sm:mt-6">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-orange-700 hover:text-orange-800">
                Login
              </Link>
            </p>
          </div>
        </div>
    </AuthBackdrop>
  );
}

/** A summary row that opens a bottom drawer holding the actual inputs. */
function DetailRow({
  label,
  summary,
  title,
  description,
  saveLabel,
  children,
}: {
  label: string;
  summary: string;
  title: string;
  description: string;
  saveLabel: string;
  children: React.ReactNode;
}) {
  return (
    <Drawer.Root>
      <Drawer.Trigger asChild>
        <button
          type="button"
          className="flex w-full items-center justify-between gap-3 rounded-xl border border-zinc-300 bg-white px-4 py-3 text-left transition-colors hover:border-zinc-400"
        >
          <span className="min-w-0">
            <span className="block text-xs font-semibold uppercase tracking-wide text-zinc-400">{label}</span>
            <span className="block break-words text-sm leading-snug text-zinc-800">{summary}</span>
          </span>
          <span className="shrink-0 text-sm font-semibold text-orange-700">Edit</span>
        </button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-60 bg-black/30" />
        <Drawer.Content className="fixed bottom-0 left-0 right-0 z-70 mx-auto max-h-[100dvh] w-full max-w-2xl overflow-y-visible rounded-t-3xl bg-white p-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-2xl outline-none sm:p-6">
          <div className="mx-auto mb-4 h-1.5 w-14 rounded-full bg-zinc-300" />
          <Drawer.Title className="text-xl font-bold text-zinc-950 sm:text-2xl">{title}</Drawer.Title>
          <Drawer.Description className="mb-5 mt-1 text-sm text-zinc-500">{description}</Drawer.Description>
          <div className="space-y-4">{children}</div>
          <Drawer.Close asChild>
            <button type="button" className="btn btn-dark btn-lg mt-6 w-full">
              {saveLabel}
            </button>
          </Drawer.Close>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
