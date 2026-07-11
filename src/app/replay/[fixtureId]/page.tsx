"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import type { TxLINEFixture } from "@/lib/types";

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

interface ReplayEvent {
  minute: number;
  label: string;
  homeScore: number;
  awayScore: number;
  type: "GOAL" | "CARD" | "SUB" | "PHASE";
}

interface ReplayChallenge {
  minute: number;
  prompt: string;
  options: string[];
  correct: number;
}

// Hardcoded replay data for a demo match
const CHALLENGES: ReplayChallenge[] = [
  { minute: 12, prompt: "Which team scores next?", options: ["Ivory Coast", "Norway"], correct: 0 },
  { minute: 34, prompt: "Will there be another card this half?", options: ["Yes", "No"], correct: 0 },
  { minute: 46, prompt: "Which team has more shots?", options: ["Ivory Coast", "Norway"], correct: 0 },
  { minute: 67, prompt: "Will there be a goal in the next 10 min?", options: ["Yes", "No"], correct: 0 },
  { minute: 80, prompt: "How many total goals?", options: ["1-2", "3-4", "5+"], correct: 0 },
];

const REPLAY_EVENTS: ReplayEvent[] = [
  { minute: 1, label: "Kick off", homeScore: 0, awayScore: 0, type: "PHASE" },
  { minute: 12, label: "⚽ Goal! Ivory Coast takes the lead", homeScore: 1, awayScore: 0, type: "GOAL" },
  { minute: 22, label: "🟨 Yellow Card — Ivory Coast", homeScore: 1, awayScore: 0, type: "CARD" },
  { minute: 34, label: "🟨 Yellow Card — Norway", homeScore: 1, awayScore: 0, type: "CARD" },
  { minute: 45, label: "⏸️ Half Time", homeScore: 1, awayScore: 0, type: "PHASE" },
  { minute: 46, label: "▶️ Second half begins", homeScore: 1, awayScore: 0, type: "PHASE" },
  { minute: 55, label: "⚽ Goal! Norway equalizes", homeScore: 1, awayScore: 1, type: "GOAL" },
  { minute: 67, label: "🔄 Substitution — Norway", homeScore: 1, awayScore: 1, type: "SUB" },
  { minute: 73, label: "⚽ Goal! Ivory Coast again!", homeScore: 2, awayScore: 1, type: "GOAL" },
  { minute: 80, label: "🟨 Yellow Card — Norway", homeScore: 2, awayScore: 1, type: "CARD" },
  { minute: 90, label: "⏱️ Full Time", homeScore: 2, awayScore: 1, type: "PHASE" },
];

function getTeamPrefix(competition?: string): string {
  return competition ?? "Match";
}

export default function ReplayRoom() {
  const params = useParams();
  const fixtureId = Number(params.fixtureId);
  const [fixture, setFixture] = useState<TxLINEFixture | null>(null);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(4);
  const [currentEventIndex, setCurrentEventIndex] = useState(-1);
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [currentMinute, setCurrentMinute] = useState(0);
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [challengeAnswer, setChallengeAnswer] = useState<number | null>(null);
  const [streak, setStreak] = useState(0);
  const [reactions, setReactions] = useState<Record<string, number>>({ fire: 0, shock: 0, skull: 0, ice: 0 });
  const [bursts, setBursts] = useState<ReactionBurst[]>([]);
  const [completed, setCompleted] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetch("/api/matches").then((r) => r.ok ? r.json() : []).then((list) => {
      const f = list.find((x: TxLINEFixture) => x.id === fixtureId);
      if (f) setFixture(f);
    }).catch(() => {});
  }, [fixtureId]);

  const currentChallenge = CHALLENGES[challengeIndex];
  const showChallenge = currentChallenge && currentMinute >= currentChallenge.minute && challengeAnswer === null;

  const advanceEvent = useCallback(() => {
    setCurrentEventIndex((prev) => {
      const next = prev + 1;
      if (next >= REPLAY_EVENTS.length) {
        setPlaying(false);
        setCompleted(true);
        return prev;
      }
      const evt = REPLAY_EVENTS[next];
      setHomeScore(evt.homeScore);
      setAwayScore(evt.awayScore);
      setCurrentMinute(evt.minute);
      return next;
    });
  }, []);

  useEffect(() => {
    if (!playing || completed) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    const delay = 3000 / speed;
    timerRef.current = setTimeout(() => {
      advanceEvent();
    }, delay);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [playing, currentEventIndex, speed, completed, advanceEvent]);

  function handlePlay() {
    if (completed) {
      setCompleted(false);
      setCurrentEventIndex(-1);
      setHomeScore(0);
      setAwayScore(0);
      setCurrentMinute(0);
      setChallengeIndex(0);
      setChallengeAnswer(null);
      setStreak(0);
    }
    setPlaying(true);
  }

  function handlePause() {
    setPlaying(false);
  }

  function handleReact(reactionId: string) {
    setReactions((prev) => ({ ...prev, [reactionId]: prev[reactionId] + 1 }));
    const burst: ReactionBurst = {
      id: `${reactionId}-${Date.now()}-${Math.random()}`,
      emoji: REACTIONS.find((r) => r.id === reactionId)!.emoji,
      x: 15 + Math.random() * 70,
    };
    setBursts((prev) => [...prev.slice(-19), burst]);
    setTimeout(() => setBursts((prev) => prev.filter((b) => b.id !== burst.id)), 1400);
  }

  function handleChallengeAnswer(optionIndex: number) {
    setChallengeAnswer(optionIndex);
    if (optionIndex === currentChallenge.correct) {
      setStreak((s) => s + 1);
    }
    setTimeout(() => {
      setChallengeIndex((i) => i + 1);
      setChallengeAnswer(null);
    }, 1200);
  }

  return (
    <div className="flex flex-col gap-6 pb-16 pt-6">
      <Link href="/matches" className="text-xs text-zinc-600 hover:text-zinc-400">
        ← Match Hub
      </Link>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">
          {fixture ? `${fixture.homeTeam} vs ${fixture.awayTeam}` : `Match ${fixtureId}`}
        </h1>
        <span className="rounded-full bg-cyan-accent/10 px-3 py-1 text-[10px] font-medium text-cyan-accent">
          REPLAY
        </span>
      </div>

      {/* Scoreboard */}
      <div className="glass-card overflow-hidden">
        <div className="flex items-center justify-between px-4 py-5">
          <div className="flex flex-col items-center gap-1.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-sm font-bold text-zinc-300">
              {fixture?.homeTeam.charAt(0) ?? "H"}
            </div>
            <span className="text-xs font-medium text-zinc-400">{fixture?.homeTeam ?? "Home"}</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-4xl font-bold tracking-tight text-white">
              {homeScore} - {awayScore}
            </span>
            <span className="font-mono text-xs text-zinc-500">{currentMinute}'</span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-sm font-bold text-zinc-300">
              {fixture?.awayTeam.charAt(0) ?? "A"}
            </div>
            <span className="text-xs font-medium text-zinc-400">{fixture?.awayTeam ?? "Away"}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between border-t border-white/5 px-4 py-2.5">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePlay}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-green-accent/20 text-green-accent transition-all hover:bg-green-accent/30 disabled:opacity-30"
              disabled={playing || completed}
            >
              ▶
            </button>
            <button
              onClick={handlePause}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white/5 text-zinc-400 transition-all hover:bg-white/10 disabled:opacity-30"
              disabled={!playing}
            >
              ⏸
            </button>
          </div>
          <div className="flex items-center gap-1.5">
            {[2, 4, 8, 16].map((s) => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={`cursor-pointer rounded-md px-2 py-1 text-[10px] font-mono transition-all ${
                  speed === s
                    ? "bg-cyan-accent/20 text-cyan-accent"
                    : "text-zinc-600 hover:bg-white/5 hover:text-zinc-400"
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Streak counter */}
      <div className="flex items-center justify-center gap-2">
        <span className="text-lg">🔥</span>
        <span className="font-mono text-sm text-zinc-400">Streak: {streak}</span>
      </div>

      {/* Current event */}
      {currentEventIndex >= 0 && !showChallenge && (
        <div className="glass-card px-4 py-3 text-center">
          <p className="text-sm font-medium text-zinc-200">
            <span className="font-mono text-zinc-500">{currentMinute}'</span>{" "}
            {REPLAY_EVENTS[currentEventIndex]?.label}
          </p>
        </div>
      )}

      {/* Challenge */}
      {showChallenge && (
        <div className="glass-card border border-cyan-accent/20 px-4 py-5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-medium uppercase tracking-wider text-cyan-accent">
              Streak Challenge
            </span>
            <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-zinc-500">
              {challengeIndex + 1}/{CHALLENGES.length}
            </span>
          </div>
          <p className="mt-2 text-sm font-medium text-white">{currentChallenge.prompt}</p>
          <div className="mt-3 flex gap-2">
            {currentChallenge.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleChallengeAnswer(i)}
                className={`flex-1 cursor-pointer rounded-xl border px-3 py-2.5 text-center text-xs font-medium transition-all active:scale-95 ${
                  challengeAnswer !== null
                    ? i === currentChallenge.correct
                      ? "border-green-accent/30 bg-green-accent/10 text-green-accent"
                      : challengeAnswer === i
                        ? "border-red-400/30 bg-red-400/10 text-red-400"
                        : "border-white/10 text-zinc-600"
                    : "border-white/10 text-zinc-300 hover:bg-white/5"
                }`}
                disabled={challengeAnswer !== null}
              >
                {opt}
              </button>
            ))}
          </div>
          {challengeAnswer !== null && (
            <p className="mt-2 text-center text-[10px] text-zinc-600">
              {challengeAnswer === currentChallenge.correct ? "✅ Correct!" : "❌ Wrong!"}
            </p>
          )}
        </div>
      )}

      {/* Reaction bar */}
      <section>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
          React
        </h2>
        <div className="glass-card relative overflow-hidden px-4 py-5">
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

      {/* Completed state */}
      {completed && (
        <div className="glass-card border border-green-accent/20 px-4 py-5 text-center">
          <span className="text-2xl">🏆</span>
          <p className="mt-2 text-sm font-medium text-green-accent">Match Complete</p>
          <p className="mt-1 text-xs text-zinc-500">
            Final: {homeScore} - {awayScore} · Streak: {streak} · Reactions:{" "}
            {Object.values(reactions).reduce((a, b) => a + b, 0)}
          </p>
          <div className="mt-4 flex justify-center gap-3">
            <button
              onClick={handlePlay}
              className="rounded-xl bg-green-accent/20 px-4 py-2 text-xs font-semibold text-green-accent transition-all hover:bg-green-accent/30"
            >
              🔄 Replay
            </button>
            <Link
              href="/matches"
              className="rounded-xl border border-white/10 px-4 py-2 text-xs font-medium text-zinc-400 transition-all hover:bg-white/5"
            >
              More Matches
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
