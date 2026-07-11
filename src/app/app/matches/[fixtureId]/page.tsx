"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { TxLINEFixture } from "@/lib/types";

const REACTIONS = [
  { id: "called-it", emoji: "🔥", label: "Called it" },
  { id: "shocked", emoji: "😱", label: "Shocked" },
  { id: "over", emoji: "💀", label: "It's over" },
  { id: "calm", emoji: "🧊", label: "Still calm" },
];
interface Burst { id: string; emoji: string; x: number }

function fakeFixture(id: number): TxLINEFixture {
  return {
    id,
    competitionId: 1,
    competition: "World Cup",
    homeTeam: "North City",
    awayTeam: "South Coast",
    startDate: new Date(Date.now() - 1800000).toISOString(),
    status: "live",
  };
}

export default function LiveRoom() {
  const params = useParams();
  const fixtureId = Number(params.fixtureId);
  const [fixture, setFixture] = useState<TxLINEFixture | null>(null);
  const [reactions, setReactions] = useState<Record<string, number>>(
    Object.fromEntries(REACTIONS.map((r) => [r.id, 0]))
  );
  const [bursts, setBursts] = useState<Burst[]>([]);
  const [challengeAnswer, setChallengeAnswer] = useState<string | null>(null);
  const [challengeResolved, setChallengeResolved] = useState(false);
  const [streak, setStreak] = useState(0);
  const [pulseData] = useState([
    { emoji: "🔥", label: "Called it", pct: 48 },
    { emoji: "😱", label: "Shocked", pct: 31 },
    { emoji: "💀", label: "It's over", pct: 14 },
    { emoji: "🧊", label: "Still calm", pct: 7 },
  ]);

  useEffect(() => {
    fetch("/api/matches")
      .then((r) => (r.ok ? r.json() : []))
      .then((list: TxLINEFixture[]) => {
        const f = list.find((x) => x.id === fixtureId);
        if (f) setFixture(f);
        else setFixture(fakeFixture(fixtureId));
      })
      .catch(() => setFixture(fakeFixture(fixtureId)));
  }, [fixtureId]);

  function handleReact(id: string) {
    setReactions((p) => ({ ...p, [id]: p[id] + 1 }));
    const burst: Burst = {
      id: `${id}-${Date.now()}`,
      emoji: REACTIONS.find((r) => r.id === id)!.emoji,
      x: 15 + Math.random() * 70,
    };
    setBursts((b) => [...b.slice(-19), burst]);
    setTimeout(() => setBursts((b) => b.filter((x) => x.id !== burst.id)), 1400);
  }

  function handleChallenge(opt: string) {
    if (challengeAnswer) return;
    setChallengeAnswer(opt);
    setTimeout(() => {
      setChallengeResolved(true);
      if (opt === "Yes") setStreak((s) => s + 1);
    }, 1500);
  }

  const name = fixture
    ? `${fixture.homeTeam} vs ${fixture.awayTeam}`
    : "Loading...";

  return (
    <div className="flex flex-col gap-4 px-4 pt-4">
      {/* Back */}
      <Link
        href="/app/matches"
        className="text-xs text-text-secondary/60 hover:text-text-primary"
      >
        ← Matches
      </Link>

      {/* Match header */}
      <div className="glass-elevated px-4 py-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[10px] font-medium text-text-secondary/50">World Cup</span>
          <span className="flex items-center gap-1.5 rounded-full bg-coral/10 px-2 py-0.5 text-[9px] font-semibold text-coral">
            <span className="h-1.5 w-1.5 animate-live-dot rounded-full bg-coral" />
            LIVE · 67'
          </span>
        </div>
        <div className="flex items-center justify-center gap-5">
          <div className="flex flex-col items-center gap-1.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface text-xs font-bold text-text-secondary">
              {fixture?.homeTeam.charAt(0) ?? "N"}
            </div>
            <span className="text-xs text-text-secondary">{fixture?.homeTeam ?? "Home"}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold">1 - 1</span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface text-xs font-bold text-text-secondary">
              {fixture?.awayTeam.charAt(0) ?? "S"}
            </div>
            <span className="text-xs text-text-secondary">{fixture?.awayTeam ?? "Away"}</span>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-center gap-1 text-[10px] text-mint">
          <span className="h-1.5 w-1.5 rounded-full bg-mint" />
          TxLINE stream active
        </div>
      </div>

      {/* Fan Pulse */}
      <div className="glass-elevated px-4 py-4">
        <span className="text-[11px] font-medium text-text-secondary">Fan Pulse</span>
        <div className="mt-3 flex flex-col gap-2">
          {pulseData.map((r) => (
            <div key={r.emoji} className="flex items-center gap-2">
              <span className="w-5 text-sm">{r.emoji}</span>
              <div className="flex-1">
                <div className="h-2 rounded-full bg-elevated overflow-hidden">
                  <div
                    className="h-2 rounded-full bg-coral transition-all duration-700"
                    style={{ width: `${r.pct}%` }}
                  />
                </div>
              </div>
              <span className="w-8 text-right text-[10px] text-text-secondary/60">{r.pct}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Current challenge */}
      <div className="glass-elevated border border-coral/20 px-4 py-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-medium uppercase tracking-wider text-coral">
            Current Challenge
          </span>
          {challengeResolved && (
            <span className="text-[10px] text-gold">Resolved</span>
          )}
        </div>
        <p className="mt-2 text-sm text-text-primary">
          Will there be another goal before 75'?
        </p>
        {!challengeResolved ? (
          <div className="mt-3 flex gap-2">
            {["Yes", "No"].map((opt) => (
              <button
                key={opt}
                onClick={() => handleChallenge(opt)}
                className={`flex-1 cursor-pointer rounded-lg border px-3 py-2 text-xs font-medium transition-all active:scale-[0.97] ${
                  challengeAnswer === opt
                    ? "border-coral/30 bg-coral/10 text-coral"
                    : "border-border text-text-secondary hover:bg-surface"
                }`}
                disabled={!!challengeAnswer}
              >
                {opt}
              </button>
            ))}
          </div>
        ) : (
          <p className="mt-2 text-xs text-mint">
            {challengeAnswer === "Yes" ? "✅ Correct! Streak +1" : "❌ Not this time"}
          </p>
        )}
        {challengeAnswer && !challengeResolved && (
          <p className="mt-2 text-[10px] text-text-secondary/50">
            Locked in: {challengeAnswer}. Waiting for TxLINE event update...
          </p>
        )}
      </div>

      {/* Reaction prompt */}
      <div className="glass-elevated px-4 py-4">
        <div className="mb-1 text-[10px] font-medium uppercase tracking-wider text-coral">
          Goal! {fixture?.homeTeam ?? "North City"} scores.
        </div>
        <p className="mb-3 text-xs text-text-secondary">How are you reacting?</p>
        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {bursts.map((b) => (
              <span
                key={b.id}
                className="absolute animate-float-up text-lg opacity-0"
                style={{
                  left: `${b.x}%`,
                  bottom: "10%",
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
                className="flex cursor-pointer flex-col items-center gap-1 transition-all active:scale-125"
              >
                <span className="text-2xl">{r.emoji}</span>
                <span className="text-[9px] text-text-secondary/60">{r.label}</span>
                <span className="font-mono text-xs text-text-secondary">{reactions[r.id]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Live event feed */}
      <div className="glass-elevated px-4 py-4">
        <span className="text-[11px] font-medium text-text-secondary">Match Events</span>
        <div className="mt-3 flex flex-col gap-2">
          {[
            { min: "67'", event: "Corner · South Coast" },
            { min: "61'", event: "Yellow card · North City" },
            { min: "54'", event: "⚽ Goal · North City" },
            { min: "31'", event: "⚽ Goal · South Coast" },
          ].map((e) => (
            <div key={e.min} className="flex items-center gap-3">
              <span className="w-8 font-mono text-[10px] text-text-secondary/40">{e.min}</span>
              <div className="h-px flex-1 bg-border/30" />
              <span className="text-xs text-text-secondary">{e.event}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Streak panel */}
      <div className="glass-elevated border border-gold/20 px-4 py-4">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-gold">Your Match Streak</span>
          <span className="text-xs font-bold text-gold">🔥 {streak}</span>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
          <div>
            <span className="text-text-secondary/50">Current</span>
            <p className="font-semibold">{streak}</p>
          </div>
          <div>
            <span className="text-text-secondary/50">Best</span>
            <p className="font-semibold">{Math.max(streak, 3)}</p>
          </div>
          <div>
            <span className="text-text-secondary/50">Correct calls</span>
            <p className="font-semibold">{streak}/3</p>
          </div>
          <div>
            <span className="text-text-secondary/50">Reaction speed</span>
            <p className="font-semibold">2.8s avg</p>
          </div>
        </div>
      </div>

      {/* Share recap CTA */}
      <Link
        href={`/app/share/${fixtureId}`}
        className="mb-8 flex items-center justify-center gap-2 rounded-xl border border-violet/30 bg-violet/5 px-4 py-3 text-sm font-medium text-violet transition-all hover:bg-violet/10 active:scale-[0.97]"
      >
        <span>▣</span> Generate recap card
      </Link>
    </div>
  );
}
