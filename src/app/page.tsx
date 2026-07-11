"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { TxLINEFixture } from "@/lib/types";

function getMatchStatus(f: TxLINEFixture): "live" | "upcoming" | "finished" {
  const elapsed = Date.now() - new Date(f.startDate).getTime();
  if (elapsed < 0) return "upcoming";
  if (elapsed < 4 * 3600000) return "live";
  return "finished";
}

const reactionEmojis = ["🔥", "😱", "💀", "🧊"];

export default function Home() {
  const [fixtures, setFixtures] = useState<TxLINEFixture[]>([]);
  const [matchIndex, setMatchIndex] = useState(0);

  useEffect(() => {
    fetch("/api/matches").then((r) => r.ok ? r.json() : []).then(setFixtures).catch(() => {});
  }, []);

  const live = fixtures.filter((f) => getMatchStatus(f) === "live");
  const upcoming = fixtures.filter((f) => getMatchStatus(f) === "upcoming");

  // Rotate through upcoming matches for the hero
  useEffect(() => {
    if (upcoming.length === 0) return;
    const timer = setInterval(() => {
      setMatchIndex((i) => (i + 1) % upcoming.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [upcoming.length]);

  const heroMatch = live[0] ?? upcoming[matchIndex];

  return (
    <div className="flex flex-col gap-10 pb-16">
      {/* Hero */}
      <section className="flex flex-col items-center pt-8 text-center">
        <span className="mb-2 rounded-full bg-green-accent/10 px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-green-accent">
          Live World Cup Companion
        </span>
        <h1 className="text-4xl font-bold leading-tight tracking-tight">
          Pulse<span className="text-gradient">Cup</span>
        </h1>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-zinc-400">
          React to live match moments, play streak challenges, and share your fan pulse — all powered by TxLINE.
        </p>
        <div className="mt-6 flex gap-3">
          <Link
            href="/matches"
            className="rounded-xl bg-green-accent px-6 py-3 text-sm font-semibold text-pitch transition-all hover:bg-green-accent/90"
          >
            Enter Match Hub
          </Link>
          <Link
            href="/matches"
            className="rounded-xl border border-white/10 px-6 py-3 text-sm font-medium text-zinc-300 transition-all hover:bg-white/5"
          >
            Replay Demo
          </Link>
        </div>
      </section>

      {/* Featured match preview */}
      {heroMatch && (
        <section className="mx-auto w-full max-w-sm">
          <div className="glass-card overflow-hidden">
            <div className="border-b border-white/5 bg-white/[0.02] px-4 py-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
                  {live[0] ? "Live Now" : "Up Next"}
                </span>
                {live[0] && (
                  <span className="flex items-center gap-1.5 text-[10px] text-red-400">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
                    LIVE
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between px-4 py-4">
              <div className="flex flex-col items-center gap-1">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-xs font-bold text-zinc-300">
                  {heroMatch.homeTeam.charAt(0)}
                </div>
                <span className="text-xs text-zinc-400">{heroMatch.homeTeam}</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-2xl font-bold tracking-tight text-white">
                  {live[0] ? "1 - 1" : "vs"}
                </span>
                <span className="text-[10px] font-mono text-zinc-600">
                  {live[0] ? "58'" : new Date(heroMatch.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-xs font-bold text-zinc-300">
                  {heroMatch.awayTeam.charAt(0)}
                </div>
                <span className="text-xs text-zinc-400">{heroMatch.awayTeam}</span>
              </div>
            </div>
            <div className="border-t border-white/5 px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex -space-x-1">
                  {reactionEmojis.map((e) => (
                    <span key={e} className="flex h-7 w-7 items-center justify-center rounded-full bg-white/5 text-xs">
                      {e}
                    </span>
                  ))}
                </div>
                <span className="text-[10px] text-zinc-600">1.2k reacting</span>
              </div>
            </div>
            <Link
              href={`/matches/${heroMatch.id}`}
              className="block border-t border-white/5 bg-white/[0.02] px-4 py-2.5 text-center text-xs font-medium text-cyan-accent transition-colors hover:bg-white/[0.04]"
            >
              Join the Pulse Room →
            </Link>
          </div>
        </section>
      )}

      {/* How it works */}
      <section className="mx-auto w-full max-w-sm">
        <h2 className="mb-4 text-center text-sm font-semibold text-zinc-200">How It Works</h2>
        <div className="flex flex-col gap-3">
          {[
            { step: "01", title: "Pick a Match", desc: "Choose any live or upcoming World Cup fixture." },
            { step: "02", title: "React & Play", desc: "React to goals, cards, corners. Answer quick streak challenges." },
            { step: "03", title: "Share Your Pulse", desc: "Get a match recap card with your fan stats. Share it." },
          ].map((s) => (
            <div key={s.step} className="flex items-center gap-3 rounded-xl bg-white/[0.02] px-4 py-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-accent/10 text-[10px] font-mono font-bold text-green-accent">
                {s.step}
              </div>
              <div>
                <span className="text-sm font-medium text-zinc-200">{s.title}</span>
                <p className="text-xs text-zinc-500">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
