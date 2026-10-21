"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import Alert from "@/components/ui/alert";
import Modal from "@/components/ui/modal";
import { useAuth } from "@/app/providers/auth-provider";
import { authAPI } from "@/lib/api/auth";
import type { APIError } from "@/lib/api/client";

const USERNAME_PATTERN = /^[a-zA-Z0-9_]+$/;
const BIO_MAX = 500;

type Field = "username" | "display_name" | "bio" | "avatar_url";
type FieldErrors = Partial<Record<Field, string>>;

interface EditProfileModalProps {
  user: API.User;
  onClose: () => void;
  onSaved: (user: API.User) => void;
}

function initials(name: string) {
  return name.split(" ").filter(Boolean).slice(0, 2).map((n) => n[0]).join("").toUpperCase() || "?";
}

function validate(values: API.UpdateProfileRequest): FieldErrors {
  const errors: FieldErrors = {};
  const username = values.username.trim();
  if (username.length < 3) errors.username = "Username must be at least 3 characters.";
  else if (username.length > 30) errors.username = "Username must not exceed 30 characters.";
  else if (!USERNAME_PATTERN.test(username)) errors.username = "Only letters, numbers and underscores.";

  if (values.display_name.length > 100) errors.display_name = "Display name must not exceed 100 characters.";
  if (values.bio.length > BIO_MAX) errors.bio = `Bio must not exceed ${BIO_MAX} characters.`;

  const avatar = values.avatar_url.trim();
  if (avatar) {
    try {
      if (new URL(avatar).protocol !== "https:") errors.avatar_url = "Use a link that starts with https://";
    } catch {
      errors.avatar_url = "That doesn't look like a valid link.";
    }
  }
  return errors;
}

export default function EditProfileModal({ user, onClose, onSaved }: EditProfileModalProps) {
  const queryClient = useQueryClient();
  const { setUser } = useAuth();

  const initial: API.UpdateProfileRequest = {
    username: user.username,
    display_name: user.display_name ?? "",
    bio: user.bio ?? "",
    avatar_url: user.avatar_url ?? "",
  };
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [saving, setSaving] = useState(false);
  const [confirmingDiscard, setConfirmingDiscard] = useState(false);
  const [avatarBroken, setAvatarBroken] = useState(false);

  const dirty = (Object.keys(initial) as Field[]).some((k) => values[k].trim() !== initial[k]);
  const usernameChanged = values.username.trim() !== initial.username;

  const set = (field: Field, value: string) => {
    setValues((v) => ({ ...v, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
    if (field === "avatar_url") setAvatarBroken(false);
  };

  const requestClose = () => {
    if (saving) return;
    if (dirty) setConfirmingDiscard(true);
    else onClose();
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving || !dirty) return;

    const found = validate(values);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      return;
    }

    setSaving(true);
    try {
      const response = await authAPI.updateProfile({
        username: values.username.trim(),
        display_name: values.display_name.trim(),
        bio: values.bio.trim(),
        avatar_url: values.avatar_url.trim(),
      });
      setUser(response.user);
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Profile updated");
      onSaved(response.user);
      onClose();
    } catch (err) {
      const apiError = err as APIError;
      const fromServer: FieldErrors = {};
      for (const [field, messages] of Object.entries(apiError.errors ?? {})) {
        if (field in initial && messages.length > 0) fromServer[field as Field] = messages[0];
      }
      if (Object.keys(fromServer).length > 0) setErrors(fromServer);
      else toast.error("Couldn't save your profile", { description: apiError.message });
    } finally {
      setSaving(false);
    }
  };

  const previewName = values.display_name.trim() || values.username.trim() || user.username;
  const showAvatar = values.avatar_url.trim() && !errors.avatar_url && !avatarBroken;

  return (
    <Modal
      open
      onRequestClose={requestClose}
      title="Edit profile"
      description="This is what other readers see."
      footer={
        confirmingDiscard ? (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-medium text-zinc-700">Discard your changes?</p>
            <div className="flex gap-2">
              <button type="button" className="btn btn-outline btn-md flex-1" onClick={() => setConfirmingDiscard(false)}>
                Keep editing
              </button>
              <button type="button" className="btn btn-dark btn-md flex-1" onClick={onClose}>
                Discard
              </button>
            </div>
          </div>
        ) : (
          <div className="flex justify-end gap-2">
            <button type="button" className="btn btn-outline btn-md" onClick={requestClose} disabled={saving}>
              Cancel
            </button>
            <button type="submit" form="edit-profile-form" className="btn btn-primary btn-md" disabled={!dirty || saving}>
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        )
      }
    >
      <form id="edit-profile-form" onSubmit={submit} noValidate className="space-y-5">
        <div className="flex items-center gap-4">
          {showAvatar ? (
            <img
              src={values.avatar_url.trim()}
              alt=""
              onError={() => setAvatarBroken(true)}
              className="h-16 w-16 flex-shrink-0 rounded-2xl object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 flex-shrink-0 select-none items-center justify-center rounded-2xl bg-brand-600 text-xl font-extrabold text-white">
              {initials(previewName)}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <label htmlFor="ep-avatar" className="mb-2 block text-sm font-medium text-zinc-700">
              Avatar link <span className="font-normal text-zinc-500">(optional)</span>
            </label>
            <input
              id="ep-avatar"
              type="url"
              inputMode="url"
              autoComplete="off"
              className="field"
              placeholder="https://…"
              value={values.avatar_url}
              onChange={(e) => set("avatar_url", e.target.value)}
              aria-invalid={!!errors.avatar_url}
            />
          </div>
        </div>
        {errors.avatar_url && <p className="-mt-3 text-xs text-red-600">{errors.avatar_url}</p>}
        {avatarBroken && !errors.avatar_url && (
          <p className="-mt-3 text-xs text-zinc-500">We couldn&apos;t load that image, so initials will be used.</p>
        )}

        <div>
          <label htmlFor="ep-display" className="mb-2 block text-sm font-medium text-zinc-700">
            Display name
          </label>
          <input
            id="ep-display"
            className="field"
            autoComplete="name"
            maxLength={100}
            placeholder="How your name appears"
            value={values.display_name}
            onChange={(e) => set("display_name", e.target.value)}
            aria-invalid={!!errors.display_name}
          />
          {errors.display_name && <p className="mt-1.5 text-xs text-red-600">{errors.display_name}</p>}
        </div>

        <div>
          <label htmlFor="ep-username" className="mb-2 block text-sm font-medium text-zinc-700">
            Username
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">@</span>
            <input
              id="ep-username"
              className="field !pl-8"
              autoComplete="username"
              autoCapitalize="none"
              spellCheck={false}
              maxLength={30}
              value={values.username}
              onChange={(e) => set("username", e.target.value)}
              aria-invalid={!!errors.username}
              aria-describedby="ep-username-hint"
            />
          </div>
          {errors.username ? (
            <p className="mt-1.5 text-xs text-red-600">{errors.username}</p>
          ) : (
            <p id="ep-username-hint" className="mt-1.5 text-xs text-zinc-500">
              3–30 letters, numbers or underscores.
            </p>
          )}
          {usernameChanged && !errors.username && (
            <Alert tone="info" className="mt-3">
              Anyone who has your old username saved won&apos;t be able to find you under it.
            </Alert>
          )}
        </div>

        <div>
          <div className="mb-2 flex items-baseline justify-between">
            <label htmlFor="ep-bio" className="text-sm font-medium text-zinc-700">
              Bio
            </label>
            <span className={`text-xs tabular-nums ${values.bio.length > BIO_MAX ? "text-red-600" : "text-zinc-500"}`}>
              {values.bio.length}/{BIO_MAX}
            </span>
          </div>
          <textarea
            id="ep-bio"
            rows={4}
            className="field !h-auto resize-y py-3"
            placeholder="A line or two about you and what you love to read or write."
            value={values.bio}
            onChange={(e) => set("bio", e.target.value)}
            aria-invalid={!!errors.bio}
          />
          {errors.bio && <p className="mt-1.5 text-xs text-red-600">{errors.bio}</p>}
        </div>

        <p className="text-xs leading-relaxed text-zinc-500">
          Your email and password aren&apos;t editable here, to keep your account safe.
        </p>
      </form>
    </Modal>
  );
}
