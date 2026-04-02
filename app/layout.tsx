import type { Metadata } from "next";
import { Akaya_Kanadaka, Geist_Mono, Sora } from "next/font/google";
import SmoothScroll from "@/components/layout/smooth-scroll";
import { Providers } from "@/app/providers";
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
  title: "Caesura",
  description: "Read and share stories",
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
        </Providers>
      </body>
    </html>
  );
}
