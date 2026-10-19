"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RefreshCw, TriangleAlert } from "lucide-react";
import StatusPage from "@/components/ui/status-page";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <StatusPage
      code="500"
      icon={TriangleAlert}
      title="Something went wrong"
      description="An unexpected error occurred on our side. Try again, and if it keeps happening we'll sort it out."
      actions={
        <>
          <button type="button" onClick={reset} className="btn btn-dark btn-lg">
            <RefreshCw className="h-4 w-4" />
            Try again
          </button>
          <Link href="/" className="btn btn-outline btn-lg">
            Go home
          </Link>
        </>
      }
      footnote={error.digest ? <span className="font-mono">Error ID: {error.digest}</span> : undefined}
    />
  );
}
