import type { Metadata } from "next";
import Link from "next/link";
import LegalLayout from "@/components/legal/legal-layout";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "What Caesura collects, why we collect it, and the choices you have.",
};

export default function PrivacyPage() {
  return (
    <LegalLayout
      eyebrow="Legal"
      title="Privacy Policy"
      summary="We collect only what we need to run Caesura, we don't sell your data, and we don't run advertising trackers."
      sections={[
        {
          id: "what-we-collect",
          title: "What we collect",
          body: (
            <>
              <p>When you create an account and use Caesura, we handle:</p>
              <ul>
                <li><strong>Account details:</strong> your email address, username and a securely hashed password. We never store your password in plain text.</li>
                <li><strong>Profile details you choose to add:</strong> display name, avatar and bio.</li>
                <li><strong>Your activity:</strong> your library, reading progress, and the stories and chapters you write or publish.</li>
              </ul>
              <p>You can browse and read without an account, and in that case we don’t ask you for personal details.</p>
            </>
          ),
        },
        {
          id: "how-we-use-it",
          title: "How we use it",
          body: (
            <>
              <ul>
                <li>To run your account and keep you signed in.</li>
                <li>To save your library and reading progress so it follows you between devices.</li>
                <li>To show the stories you publish to other readers.</li>
                <li>To send essential emails, such as a password reset link you requested.</li>
                <li>To keep Caesura secure and prevent abuse.</li>
              </ul>
              <p>We don’t use your reading activity for advertising, and we don’t sell your personal data.</p>
            </>
          ),
        },
        {
          id: "storage-and-cookies",
          title: "Cookies and local storage",
          body: (
            <>
              <p>
                To keep you signed in, Caesura stores a sign-in token and a copy of your basic profile in your browser’s local
                storage, along with your reading settings and progress. This is essential to how the site works, and it is cleared
                when you sign out.
              </p>
              <p>We don’t use third-party advertising or analytics trackers.</p>
            </>
          ),
        },
        {
          id: "sharing",
          title: "Who we share it with",
          body: (
            <>
              <p>We share information only where it’s needed to run the service:</p>
              <ul>
                <li><strong>Other readers</strong> can see what you publish and the public parts of your profile.</li>
                <li><strong>Service providers</strong> that host Caesura and deliver email act on our behalf and only for those purposes.</li>
                <li><strong>Legal requests:</strong> we may disclose information if the law requires it.</li>
              </ul>
            </>
          ),
        },
        {
          id: "security-retention",
          title: "Security and retention",
          body: (
            <>
              <p>
                Passwords are hashed, password reset links expire after one hour and work only once, and traffic to Caesura is
                encrypted in transit. No system is perfectly secure, but we take reasonable steps to protect your information.
              </p>
              <p>We keep your information while your account is active. If you delete your account, we remove your personal data, except where we must keep it for legal reasons.</p>
            </>
          ),
        },
        {
          id: "your-choices",
          title: "Your choices",
          body: (
            <>
              <p>You can:</p>
              <ul>
                <li>Edit your profile details at any time from your profile page.</li>
                <li>Ask for a copy of the information we hold about you.</li>
                <li>Ask us to correct or delete your account and data.</li>
              </ul>
              <p>To make a request, <Link href="/contact" className="font-semibold text-brand-700 hover:text-brand-800">contact us</Link>.</p>
            </>
          ),
        },
        {
          id: "children",
          title: "Children",
          body: <p>Caesura is not directed at children under 13, and we don’t knowingly collect their personal information. If you believe a child has given us their details, please contact us and we’ll remove them.</p>,
        },
        {
          id: "changes",
          title: "Changes to this policy",
          body: <p>If we change this policy in a meaningful way, we’ll update the date at the top of this page and, where appropriate, let you know in the app or by email.</p>,
        },
      ]}
    />
  );
}
