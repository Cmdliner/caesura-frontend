import type { Metadata } from "next";
import Link from "next/link";
import LegalLayout from "@/components/legal/legal-layout";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The rules for using Caesura: your account, your stories and how we keep the community friendly.",
};

export default function TermsPage() {
  return (
    <LegalLayout
      eyebrow="Legal"
      title="Terms of Service"
      summary="The ground rules for reading and writing on Caesura. Short version: be kind, be honest, and your stories stay yours."
      sections={[
        {
          id: "agreement",
          title: "Using Caesura",
          body: (
            <p>
              By creating an account or using Caesura, you agree to these terms and to our{" "}
              <Link href="/privacy" className="font-semibold text-brand-700 hover:text-brand-800">Privacy Policy</Link>. If you don’t agree, please don’t use the service.
            </p>
          ),
        },
        {
          id: "your-account",
          title: "Your account",
          body: (
            <ul>
              <li>You must be at least 13 years old to create an account.</li>
              <li>Give accurate information and keep your password private. You’re responsible for activity on your account.</li>
              <li>Tell us if you think someone else has accessed your account.</li>
            </ul>
          ),
        },
        {
          id: "your-content",
          title: "Your stories and content",
          body: (
            <>
              <p><strong>You own what you write.</strong> Caesura doesn’t claim ownership of your stories, chapters or other content.</p>
              <p>
                When you publish on Caesura, you give us permission to host, display and distribute that content so the service
                can work, for example showing your story to readers and in search. This permission ends when you remove the
                content or delete your account, apart from reasonable backup copies.
              </p>
              <p>Only publish work that you wrote or have the right to share.</p>
            </>
          ),
        },
        {
          id: "community-rules",
          title: "Community rules",
          body: (
            <>
              <p>To keep Caesura welcoming, please don’t:</p>
              <ul>
                <li>Harass, threaten or demean other people.</li>
                <li>Post content that is illegal, or that sexualises minors.</li>
                <li>Publish other people’s work as your own, or content that infringes their rights.</li>
                <li>Spam, scrape the service at scale, or try to break or bypass its security.</li>
              </ul>
              <p>Mature themes in fiction are fine when they’re appropriately labelled. We may remove content or suspend accounts that break these rules.</p>
            </>
          ),
        },
        {
          id: "public-domain",
          title: "Public-domain books",
          body: <p>Some books on Caesura are public-domain works, sourced from places such as Project Gutenberg. They’re free for everyone to read, and are credited to their original authors.</p>,
        },
        {
          id: "service",
          title: "The service",
          body: (
            <>
              <p>We work hard to keep Caesura running, but we provide it “as is” and can’t promise it will always be available or free of errors. Features may change, and we may add or remove them over time.</p>
              <p>To the extent the law allows, Caesura isn’t liable for indirect or consequential losses arising from your use of the service.</p>
            </>
          ),
        },
        {
          id: "ending",
          title: "Ending your account",
          body: <p>You can stop using Caesura and ask us to delete your account at any time. We may suspend or close accounts that seriously or repeatedly break these terms.</p>,
        },
        {
          id: "changes",
          title: "Changes to these terms",
          body: (
            <p>
              We may update these terms from time to time. We’ll change the date at the top, and if the changes are significant we’ll
              tell you. Continuing to use Caesura after an update means you accept the new terms.
            </p>
          ),
        },
      ]}
    />
  );
}
