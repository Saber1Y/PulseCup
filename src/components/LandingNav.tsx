"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function LandingNav() {
  const pathname = usePathname();

  // Only show on landing page
  if (pathname !== "/") return null;

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-border bg-surface/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-bold tracking-tight text-text-primary">
          Pulse<span className="text-gradient">Cup</span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          <a href="#how-it-works" className="text-sm text-text-secondary transition-colors hover:text-text-primary">
            How it works
          </a>
          <Link href="/app/matches" className="text-sm text-text-secondary transition-colors hover:text-text-primary">
            Live rooms
          </Link>
          <Link href="/app/replay/1" className="text-sm text-text-secondary transition-colors hover:text-text-primary">
            Replay demo
          </Link>
          <Link href="/docs" className="text-sm text-text-secondary transition-colors hover:text-text-primary">
            Docs
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/app/matches"
            className="rounded-xl bg-coral px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-coral/90 active:scale-[0.97]"
          >
            Enter live matches
          </Link>
        </div>
      </div>
    </nav>
  );
}
