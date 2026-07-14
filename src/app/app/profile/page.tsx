"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { IoStatsChart, IoFlash } from "react-icons/io5";
import { TeamWithFlag } from "@/lib/flags";
import { getGuestProfileId } from "@/lib/guest";
import type { RecapCard } from "@/lib/types";

export default function ProfilePage() {
  const [recaps, setRecaps] = useState<RecapCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const pid = getGuestProfileId();
    fetch(`/api/recaps?profileId=${pid}`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        if (Array.isArray(data)) setRecaps(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totalReactions = recaps.reduce((s, r) => s + r.totalReactions, 0);
  const bestStreak = Math.max(0, ...recaps.map((r) => r.bestStreak));
  const totalCorrect = recaps.reduce((s, r) => {
    const m = String(r.correctCalls).match(/^(\d+)/);
    return s + (m ? parseInt(m[1], 10) : 0);
  }, 0);
  const totalAnswered = recaps.reduce((s, r) => {
    const m = String(r.correctCalls).match(/(\d+)$/);
    return s + (m ? parseInt(m[1], 10) : 0);
  }, 0);

  return (
    <div className="flex flex-col gap-4 px-4 pt-6 pb-8">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-coral/30 to-violet/30 text-xl">
          <span className="font-bold text-text-primary">G</span>
        </div>
        <div>
          <h1 className="text-lg font-bold">Guest Fan</h1>
          <p className="text-xs text-text-secondary">
            {recaps.length > 0
              ? `${recaps.length} match${recaps.length > 1 ? "es" : ""} watched`
              : "No matches watched yet."}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="glass-elevated px-4 py-8 text-center">
          <p className="text-sm text-text-secondary/50">Loading...</p>
        </div>
      ) : recaps.length > 0 ? (
        <>
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-xl bg-surface/50 px-3 py-3 text-center">
              <span className="text-lg font-bold text-gold">{totalCorrect}/{totalAnswered}</span>
              <p className="text-[10px] text-text-secondary/50">Correct calls</p>
            </div>
            <div className="rounded-xl bg-surface/50 px-3 py-3 text-center">
              <span className="text-lg font-bold text-violet">{totalAnswered}</span>
              <p className="text-[10px] text-text-secondary/50">Answered</p>
            </div>
            <div className="rounded-xl bg-surface/50 px-3 py-3 text-center">
              <span className="text-lg font-bold text-mint">{bestStreak}</span>
              <p className="text-[10px] text-text-secondary/50">Best streak</p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-[11px] font-medium text-text-secondary">Recap Cards</span>
            {recaps.map((r) => (
              <Link
                key={r.id}
                href={`/app/share/${r.id}`}
                className="glass-elevated flex items-center justify-between px-4 py-3 transition-all hover:border-coral/20"
              >
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-text-primary">
                    <TeamWithFlag name={r.homeTeam} /> {r.homeScore} - {r.awayScore} <TeamWithFlag name={r.awayTeam} />
                  </span>
                  <span className="text-[10px] text-text-secondary/50">
                    {r.mood} · {r.correctCalls} correct · Best streak {r.bestStreak}
                  </span>
                </div>
                <span className="text-xs text-coral">View →</span>
              </Link>
            ))}
          </div>
        </>
      ) : (
        <div className="glass-elevated px-4 py-8 text-center">
          <IoStatsChart className="mx-auto text-3xl text-text-secondary/40" />
          <p className="mt-3 text-sm text-text-secondary">No recaps yet</p>
          <p className="mt-1 text-xs text-text-secondary/50">
            Watch a match and answer challenges to build your profile.
          </p>
          <Link
            href="/app/matches"
            className="mt-4 inline-block rounded-lg bg-coral px-5 py-2.5 text-xs font-semibold text-white"
          >
            Find a Match
          </Link>
        </div>
      )}
    </div>
  );
}
