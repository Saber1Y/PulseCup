"use client";

import Link from "next/link";

export default function ProfilePage() {
  return (
    <div className="flex flex-col gap-4 px-4 pt-6">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-coral/30 to-violet/30 text-xl">
          <span className="font-bold text-text-primary">G</span>
        </div>
        <div>
          <h1 className="text-lg font-bold">Guest Fan</h1>
          <p className="text-xs text-text-secondary">
            No matches watched yet.
          </p>
        </div>
      </div>

      <div className="glass-elevated px-4 py-8 text-center">
        <span className="text-3xl">📊</span>
        <p className="mt-3 text-sm text-text-secondary">No stats yet</p>
        <p className="mt-1 text-xs text-text-secondary/50">
          Stats appear after you watch a match and answer challenges.
        </p>
        <Link
          href="/app/matches"
          className="mt-4 inline-block rounded-lg bg-coral px-5 py-2.5 text-xs font-semibold text-white"
        >
          Find a Match
        </Link>
      </div>

      <div className="glass-elevated px-4 py-4">
        <span className="text-[11px] font-medium text-text-secondary">Recap Cards</span>
        <p className="mt-2 text-xs text-text-secondary/50">
          Recap cards are generated after watching a match.
        </p>
      </div>

      <div className="mb-8 rounded-xl border border-border bg-surface/50 px-4 py-4 text-center">
        <p className="text-xs text-text-secondary">
          Connect wallet to save your pulse across devices.
        </p>
        <button className="mt-2 cursor-pointer rounded-lg border border-violet/30 bg-violet/5 px-4 py-2 text-xs font-medium text-violet transition-all hover:bg-violet/10">
          Connect Solana Wallet
        </button>
      </div>
    </div>
  );
}
