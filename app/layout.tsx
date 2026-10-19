import type { Metadata, Viewport } from "next";
import { Akaya_Kanadaka, Geist_Mono, Sora } from "next/font/google";
import SmoothScroll from "@/components/layout/smooth-scroll";
import { Providers } from "@/app/providers";
import { Toaster } from "sonner";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const akayaKanadaka = Akaya_Kanadaka({
  variable: "--font-akaya-kanadaka",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  // Needed so the generated share image (opengraph-image) gets an absolute URL.
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: "Caesura: read and share stories", template: "%s | Caesura" },
  description: "Original stories from emerging writers. Read, write and share on Caesura.",
  applicationName: "Caesura",
};

export const viewport: Viewport = {
  themeColor: "#ea580c",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sora.variable} ${geistMono.variable} ${akayaKanadaka.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          <SmoothScroll>{children}</SmoothScroll>
          <Toaster
            position="bottom-right"
            richColors
            toastOptions={{
              duration: 3500,
              style: { fontFamily: "var(--font-sora), sans-serif", fontSize: "13.5px", borderRadius: "14px", boxShadow: "0 8px 30px rgba(0,0,0,0.12)" },
            }}
          />
        </Providers>
      </body>

    </html>
  );
}
