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

export const metadata: Metadata = {
  title: "Luogo dei Ricordi",
  description: "Uno spazio per i ricordi che non sbiadiscono mai",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body suppressHydrationWarning className="bg-[#F5F0EB] text-[#2C2C2E] min-h-screen flex flex-col font-cormorant">
        <Header />
        <main className="flex-1 max-w-[1100px] mx-auto px-6 pb-16 w-full">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}