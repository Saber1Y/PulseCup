"use client";

import Link from "next/link";

const stats = {
  bestStreak: 7,
  correctCalls: "18/29",
  fastestReaction: "2.4s",
  mood: "Chaos Merchant",
  totalReactions: 142,
  matchesWatched: 3,
};

export default function ProfilePage() {
  return (
    <div className="flex flex-col gap-4 px-4 pt-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-coral/30 to-violet/30 text-xl">
          <span className="font-bold text-text-primary">G</span>
        </div>
        <div>
          <h1 className="text-lg font-bold">Guest Fan</h1>
          <p className="text-xs text-text-secondary">
            {stats.matchesWatched} matches watched
          </p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Best streak", value: `🔥 ${stats.bestStreak}` },
          { label: "Correct calls", value: stats.correctCalls },
          { label: "Fastest reaction", value: stats.fastestReaction },
          { label: "Total reactions", value: stats.totalReactions },
        ].map((s) => (
          <div key={s.label} className="glass-elevated px-4 py-4">
            <span className="text-[10px] text-text-secondary/50">{s.label}</span>
            <p className="mt-1 text-sm font-bold">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Fan mood */}
      <div className="glass-elevated border border-gold/20 px-4 py-4">
        <span className="text-[10px] text-text-secondary/50">Fan Mood</span>
        <p className="mt-1 text-sm font-semibold text-gold">{stats.mood}</p>
      </div>

      {/* Recap cards */}
      <div className="glass-elevated px-4 py-4">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-text-secondary">Recap Cards</span>
        </div>
        <div className="mt-3 flex flex-col gap-2">
          {[
            { teams: "North City vs South Coast", streak: 7, date: "Today" },
            { teams: "Metro United vs Valley FC", streak: 5, date: "Yesterday" },
          ].map((card) => (
            <Link
              key={card.teams}
              href={`/app/share/1`}
              className="flex items-center justify-between rounded-xl bg-surface px-3 py-2.5 transition-all hover:bg-elevated"
            >
              <div>
                <span className="text-xs font-medium">{card.teams}</span>
                <p className="text-[10px] text-text-secondary/50">{card.date}</p>
              </div>
              <span className="text-xs text-gold">🔥 {card.streak}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Sign in */}
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
