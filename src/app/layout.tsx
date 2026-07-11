import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.css";
import dynamic from "next/dynamic";

const sora = Sora({ subsets: ["latin"], display: "swap" });

const LandingNav = dynamic(() => import("@/components/LandingNav"), { ssr: false });

export const metadata: Metadata = {
  title: "PulseCup — Feel Every Match Moment",
  description:
    "PulseCup turns World Cup match data into live fan reactions, streak challenges, and shareable recap cards.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${sora.className} min-h-screen bg-bg-deep text-text-primary antialiased`}>
        <LandingNav />
        {children}
      </body>
    </html>
  );
}
