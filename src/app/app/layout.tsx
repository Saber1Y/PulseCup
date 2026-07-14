import type { Metadata } from "next";
import Link from "next/link";
import AppBottomNav from "@/components/AppBottomNav";
import { Logo } from "@/components/Logo";

export const metadata: Metadata = {
  title: "PulseCup — Live Match Room",
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto min-h-screen max-w-lg pb-20">
      <div className="sticky top-0 z-50 border-b border-border bg-bg-deep/90 backdrop-blur-xl">
        <div className="flex items-center px-4 py-2.5">
          <Link href="/app/matches" className="flex items-center gap-2">
            <Logo size="sm" />
          </Link>
        </div>
      </div>
      {children}
      <AppBottomNav />
    </div>
  );
}
