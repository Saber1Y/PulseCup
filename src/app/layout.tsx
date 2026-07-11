import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.css";
import LandingNav from "@/components/LandingNav";

const sora = Sora({ subsets: ["latin"], display: "swap" });

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
