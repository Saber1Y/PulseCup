"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { TxLINEFixture } from "@/lib/types";
import { fetchFixtures } from "@/lib/txline/client";

const REACTIONS = [
  { id: "fire", emoji: "🔥", label: "Fire" },
  { id: "shock", emoji: "😱", label: "Shock" },
  { id: "skull", emoji: "💀", label: "Skull" },
  { id: "ice", emoji: "🧊", label: "Ice" },
];

interface ReactionBurst {
  id: string;
  emoji: string;
  x: number;
}

function getMatchStatus(f: TxLINEFixture): "live" | "upcoming" | "finished" {
  const elapsed = Date.now() - new Date(f.startDate).getTime();
  if (elapsed < 0) return "upcoming";
  if (elapsed < 4 * 3600000) return "live";
  return "finished";
}

export default function PulseRoom() {
  const params = useParams();
  const fixtureId = Number(params.fixtureId);
  const [fixture, setFixture] = useState<TxLINEFixture | null>(null);
  const [reactions, setReactions] = useState<Record<string, number>>(
    Object.fromEntries(REACTIONS.map((r) => [r.id, 0]))
  );
  const [bursts, setBursts] = useState<ReactionBurst[]>([]);

  useEffect(() => {
    fetchFixtures().then((list) => {
      const f = list.find((x) => x.id === fixtureId);
      if (f) setFixture(f);
    }).catch(() => {});
  }, [fixtureId]);

  const status = fixture ? getMatchStatus(fixture) : "upcoming";

  function handleReact(reactionId: string) {
    setReactions((prev) => ({ ...prev, [reactionId]: prev[reactionId] + 1 }));

    const burst: ReactionBurst = {
      id: `${reactionId}-${Date.now()}-${Math.random()}`,
      emoji: REACTIONS.find((r) => r.id === reactionId)!.emoji,
      x: 15 + Math.random() * 70,
    };
    setBursts((prev) => [...prev.slice(-19), burst]);
    setTimeout(() => {
      setBursts((prev) => prev.filter((b) => b.id !== burst.id));
    }, 1400);
  }

  return (
    <div className="flex flex-col gap-6 pb-16 pt-6">
      <Link href="/matches" className="text-xs text-zinc-600 hover:text-zinc-400">
        ← Match Hub
      </Link>

      {/* Match header */}
      {fixture && (
        <div className="glass-card overflow-hidden">
          <div className="border-b border-white/5 px-4 py-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
                {fixture.competition}
              </span>
              {status === "live" && (
                <span className="flex items-center gap-1.5 text-[10px] text-red-400">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
                  LIVE
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between px-4 py-5">
            <div className="flex flex-col items-center gap-1.5">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-sm font-bold text-zinc-300">
                {fixture.homeTeam.charAt(0)}
              </div>
              <span className="text-xs font-medium text-zinc-400">{fixture.homeTeam}</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              {status === "live" ? (
                <>
                  <span className="text-3xl font-bold tracking-tight text-white">1 - 1</span>
                  <span className="font-mono text-[10px] text-zinc-600">58'</span>
                </>
              ) : status === "finished" ? (
                <>
                  <span className="text-3xl font-bold tracking-tight text-white">2 - 0</span>
                  <span className="text-[10px] text-zinc-600">Full Time</span>
                </>
              ) : (
                <>
                  <span className="text-lg text-zinc-400">vs</span>
                  <span className="text-[10px] font-mono text-zinc-600">
                    {new Date(fixture.startDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </>
              )}
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-sm font-bold text-zinc-300">
                {fixture.awayTeam.charAt(0)}
              </div>
              <span className="text-xs font-medium text-zinc-400">{fixture.awayTeam}</span>
            </div>
          </div>
        </div>
      )}

      {/* Reaction bar */}
      <section>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
          React to the match
        </h2>
        <div className="glass-card relative overflow-hidden px-4 py-5">
          {/* Emoji bursts */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {bursts.map((b) => (
              <span
                key={b.id}
                className="absolute animate-float-up text-xl opacity-0"
                style={{
                  left: `${b.x}%`,
                  bottom: "10%",
                  animation: "float-up 1.4s ease-out forwards",
                }}
              >
                {b.emoji}
              </span>
            ))}
          </div>

          <div className="flex justify-around">
            {REACTIONS.map((r) => (
              <button
                key={r.id}
                onClick={() => handleReact(r.id)}
                className="flex cursor-pointer flex-col items-center gap-1 transition-transform active:scale-125"
              >
                <span className="text-2xl">{r.emoji}</span>
                <span className="text-[10px] font-medium text-zinc-500">{r.label}</span>
                <span className="font-mono text-xs text-zinc-400">{reactions[r.id]}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Streak challenge placeholder */}
      <section>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Streak Challenge
        </h2>
        <div className="glass-card px-4 py-5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-medium uppercase tracking-wider text-cyan-accent">
                Next Goal
              </span>
              <p className="mt-1 text-sm text-zinc-300">Which team scores next?</p>
            </div>
            <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-zinc-500">
              🔥 x2
            </span>
          </div>
          <div className="mt-4 flex gap-2">
            {fixture && (
              <>
                <button className="flex-1 cursor-pointer rounded-xl border border-white/10 px-3 py-2.5 text-center text-xs font-medium text-zinc-300 transition-all hover:bg-white/5 active:scale-95">
                  {fixture.homeTeam}
                </button>
                <button className="flex-1 cursor-pointer rounded-xl border border-white/10 px-3 py-2.5 text-center text-xs font-medium text-zinc-300 transition-all hover:bg-white/5 active:scale-95">
                  {fixture.awayTeam}
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Replay CTA for non-live */}
      {status !== "live" && (
        <Link
          href={`/replay/${fixtureId}`}
          className="flex items-center justify-center gap-2 rounded-xl border border-cyan-accent/20 bg-cyan-accent/5 px-4 py-3 text-sm font-medium text-cyan-accent transition-all hover:bg-cyan-accent/10"
        >
          ▶ Replay this match
        </Link>
      )}

      {/* Event feed placeholder */}
      <section>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Match Events
        </h2>
        <div className="flex flex-col gap-2">
          {[
            { min: "12'", event: "⚽ Goal", detail: "Great strike from outside the box" },
            { min: "34'", event: "🟨 Yellow Card", detail: "Late tackle, deserved caution" },
            { min: "58'", event: "🔄 Substitution", detail: "Fresh legs coming on" },
          ].map((e, i) => (
            <div key={i} className="glass-card flex items-center gap-3 px-4 py-2.5">
              <span className="w-8 font-mono text-[10px] text-zinc-600">{e.min}</span>
              <div>
                <span className="text-xs font-medium text-zinc-300">{e.event}</span>
                <p className="text-[10px] text-zinc-600">{e.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
