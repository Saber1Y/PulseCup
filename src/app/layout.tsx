import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PulseCup — Live Fan Reactions for World Cup",
  description: "React to live match moments, play streak challenges, and share your fan pulse.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-pitch text-white antialiased`}>
        <main className="mx-auto max-w-lg px-4 pb-20">{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}
