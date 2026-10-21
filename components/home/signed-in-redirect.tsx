"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers/auth-provider";
import { STORAGE_KEYS } from "@/lib/constants";

/** Add ?landing=1 to see the landing page while signed in. */
const BYPASS = "landing=1";

// Runs while the HTML is still being parsed, so a signed-in visitor is sent on before the landing page paints.
// The auth state lives in localStorage, which the server can't see, hence a script rather than a server redirect.
const EARLY_REDIRECT = `try{if(localStorage.getItem(${JSON.stringify(STORAGE_KEYS.AUTH_TOKEN)})&&location.search.indexOf(${JSON.stringify(BYPASS)})<0)location.replace("/library")}catch(e){}`;

/**
 * Signed-in people don't need the marketing page: send them to their library.
 * The inline script covers a fresh page load; the effect covers client-side navigation (e.g. clicking the logo),
 * where inline scripts don't run.
 */
export default function SignedInRedirect() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && !window.location.search.includes(BYPASS)) router.replace("/library");
  }, [isAuthenticated, router]);

  return <script dangerouslySetInnerHTML={{ __html: EARLY_REDIRECT }} />;
}
