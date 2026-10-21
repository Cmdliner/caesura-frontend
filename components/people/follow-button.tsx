"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Check, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/app/providers/auth-provider";
import { peopleAPI } from "@/lib/api/people";
import type { APIError } from "@/lib/api/client";

interface FollowButtonProps {
  username: string;
  isFollowing: boolean;
  onChange?: (result: API.FollowResult) => void;
  size?: "md" | "lg";
}

/** Follow / Following toggle. Updates instantly and rolls back if the request fails. */
export default function FollowButton({ username, isFollowing, onChange, size = "md" }: FollowButtonProps) {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [following, setFollowing] = useState(isFollowing);
  const [seen, setSeen] = useState(isFollowing);
  const [busy, setBusy] = useState(false);

  // Take the server's word whenever the parent hands us fresh data.
  if (isFollowing !== seen) {
    setSeen(isFollowing);
    setFollowing(isFollowing);
  }

  const toggle = async () => {
    if (busy) return;
    if (!isAuthenticated) {
      toast.error("Sign in to follow writers", {
        action: { label: "Sign in", onClick: () => (window.location.href = "/login") },
      });
      return;
    }

    const next = !following;
    setFollowing(next);
    setBusy(true);
    try {
      const result = next ? await peopleAPI.follow(username) : await peopleAPI.unfollow(username);
      setFollowing(result.following);
      onChange?.(result);
      // Mark lists stale without refetching them right now, so cards don't reshuffle under the cursor.
      queryClient.invalidateQueries({ queryKey: ["people"], refetchType: "none" });
      queryClient.invalidateQueries({ queryKey: ["public-profile", username], refetchType: "none" });
    } catch (err) {
      setFollowing(!next);
      toast.error(next ? "Couldn't follow" : "Couldn't unfollow", { description: (err as APIError).message });
    } finally {
      setBusy(false);
    }
  };

  const cls = size === "lg" ? "btn-lg" : "btn-md";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={following}
      disabled={busy}
      className={`btn ${cls} flex-shrink-0 ${following ? "btn-outline" : "btn-primary"}`}
    >
      {following ? <Check className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
      {following ? "Following" : "Follow"}
    </button>
  );
}
