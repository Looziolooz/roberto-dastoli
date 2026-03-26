import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-cormorant",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm-sans",
  display: "swap",
});

// seo-specialist: full metadata with OpenGraph for sharing
export const metadata: Metadata = {
  title: {
    default: "Roberto Dastoli",
    template: "%s — Roberto Dastoli",
  },
  description:
    "Uno spazio intimo per conservare e condividere i ricordi di chi amiamo. Foto, racconti e momenti che non svaniscono mai.",
  keywords: ["ricordi", "memoriale", "famiglia", "foto", "racconto"],
  openGraph: {
    title: "Roberto Dastoli",
    description: "Uno spazio dove i ricordi diventano immortali.",
    type: "website",
    locale: "it_IT",
  },
  robots: {
    // seo-specialist: private memorial — no public indexing
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body
        suppressHydrationWarning
        className="bg-[#F5F0EB] text-[#2C2C2E] min-h-screen flex flex-col font-cormorant"
      >
        <Header />
        <main className="flex-1 max-w-[1100px] mx-auto px-6 pb-16 w-full">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
