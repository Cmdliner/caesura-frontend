import Link from "next/link";
import { BookX, Compass, House } from "lucide-react";
import StatusPage from "@/components/ui/status-page";

export default function NotFound() {
  return (
    <StatusPage
      code="404"
      icon={BookX}
      title="This page is missing from the shelf"
      description="The page you're looking for doesn't exist or has moved. Let's get you back to a good story."
      actions={
        <>
          <Link href="/" className="btn btn-dark btn-lg">
            <House className="h-4 w-4" />
            Go home
          </Link>
          <Link href="/discover" className="btn btn-outline btn-lg">
            <Compass className="h-4 w-4" />
            Browse stories
          </Link>
        </>
      }
    />
  );
}
