"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

export default function ShareCardPage() {
  const params = useParams();
  const cardId = params.cardId;

  const recap = {
    name: "Guest Fan",
    homeTeam: "North City",
    awayTeam: "South Coast",
    homeScore: 2,
    awayScore: 1,
    bestStreak: 7,
    correctCalls: "8/12",
    fastestReaction: "2.4s",
    mood: "Chaos Merchant",
    totalReactions: 24,
  };

  return (
    <div className="flex flex-col gap-4 px-4 pt-6">
      <Link href="/app/matches" className="text-xs text-text-secondary/60 hover:text-text-primary">
        ← Matches
      </Link>

      <h1 className="text-lg font-bold">Match Recap</h1>

      {/* Card visual */}
      <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-coral/20 via-violet/20 to-gold/10 p-[1px]">
        <div className="rounded-2xl bg-bg-deep px-6 py-8">
          <div className="mb-6 text-center">
            <span className="text-xs font-medium uppercase tracking-widest text-text-secondary/50">
              {recap.name}&rsquo;s Match Pulse
            </span>
          </div>
          <div className="mb-6 flex items-center justify-center gap-4">
            <span className="text-sm font-medium">{recap.homeTeam}</span>
            <span className="text-2xl font-bold">
              {recap.homeScore} - {recap.awayScore}
            </span>
            <span className="text-sm font-medium">{recap.awayTeam}</span>
          </div>

          <div className="mb-6 flex items-center justify-center">
            <div className="flex items-center gap-1 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5">
              <span className="text-sm">🔥</span>
              <span className="text-xs font-bold text-gold">Best streak: {recap.bestStreak}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              { label: "Correct", value: recap.correctCalls },
              { label: "Reaction", value: recap.fastestReaction },
              { label: "Mood", value: recap.mood },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-xs font-bold">{s.value}</p>
                <p className="text-[9px] text-text-secondary/50">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center text-[9px] text-text-secondary/30">
            Powered by PulseCup + TxLINE
          </div>
        </div>
      </div>

      {/* CTAs */}
      <div className="flex flex-col gap-2">
        <button className="w-full cursor-pointer rounded-xl bg-coral px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-coral/90 active:scale-[0.97]">
          Share card
        </button>
        <button className="w-full cursor-pointer rounded-xl border border-border px-4 py-3 text-sm font-medium text-text-secondary transition-all hover:bg-surface active:scale-[0.97]">
          Download image
        </button>
        <Link
          href="/app/matches"
          className="block rounded-xl border border-border px-4 py-3 text-center text-sm font-medium text-text-secondary transition-all hover:bg-surface"
        >
          Play another match
        </Link>
      </div>
    </div>
  );
}
