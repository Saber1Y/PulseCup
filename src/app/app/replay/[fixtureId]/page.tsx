"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

interface ReplayEvt {
  min: number;
  label: string;
  homeScore: number;
  awayScore: number;
  type: "GOAL" | "CARD" | "CORNER" | "PHASE";
}

interface Challenge {
  minute: number;
  prompt: string;
  options: string[];
  correct: number;
}

const REPLAY_EVENTS: ReplayEvt[] = [
  { min: 1, label: "Kick off", homeScore: 0, awayScore: 0, type: "PHASE" },
  { min: 12, label: "⚽ Goal! North City takes the lead", homeScore: 1, awayScore: 0, type: "GOAL" },
  { min: 22, label: "🟨 Yellow Card — North City", homeScore: 1, awayScore: 0, type: "CARD" },
  { min: 31, label: "⚽ Goal! South Coast equalizes", homeScore: 1, awayScore: 1, type: "GOAL" },
  { min: 34, label: "🟨 Yellow Card — South Coast", homeScore: 1, awayScore: 1, type: "CARD" },
  { min: 45, label: "⏸️ Half Time", homeScore: 1, awayScore: 1, type: "PHASE" },
  { min: 46, label: "▶️ Second half begins", homeScore: 1, awayScore: 1, type: "PHASE" },
  { min: 55, label: "⏩ Corner — South Coast", homeScore: 1, awayScore: 1, type: "CORNER" },
  { min: 72, label: "⚽ Goal! North City scores again", homeScore: 2, awayScore: 1, type: "GOAL" },
  { min: 80, label: "🟨 Yellow Card — South Coast", homeScore: 2, awayScore: 1, type: "CARD" },
  { min: 90, label: "⏱️ Full Time", homeScore: 2, awayScore: 1, type: "PHASE" },
];

const CHALLENGES: Challenge[] = [
  { minute: 10, prompt: "Will there be a goal in the first half?", options: ["Yes", "No"], correct: 0 },
  { minute: 28, prompt: "Will South Coast score again?", options: ["Yes", "No"], correct: 0 },
  { minute: 50, prompt: "Will there be a red card this match?", options: ["Yes", "No"], correct: 1 },
  { minute: 70, prompt: "How many total goals?", options: ["1-2", "3-4", "5+"], correct: 0 },
];

const REACTIONS = [
  { id: "called-it", emoji: "🔥", label: "Called it" },
  { id: "shocked", emoji: "😱", label: "Shocked" },
  { id: "over", emoji: "💀", label: "It's over" },
  { id: "calm", emoji: "🧊", label: "Still calm" },
];

interface Burst { id: string; emoji: string; x: number }

export default function ReplayPage() {
  const params = useParams();
  const fixtureId = Number(params.fixtureId);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(4);
  const [eventIdx, setEventIdx] = useState(-1);
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [minute, setMinute] = useState(0);
  const [challengeIdx, setChallengeIdx] = useState(0);
  const [challengeAnswer, setChallengeAnswer] = useState<number | null>(null);
  const [streak, setStreak] = useState(0);
  const [burnt, setBurnt] = useState(false);
  const [reactions, setReactions] = useState<Record<string, number>>(
    Object.fromEntries(REACTIONS.map((r) => [r.id, 0]))
  );
  const [bursts, setBursts] = useState<Burst[]>([]);
  const [completed, setCompleted] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentChallenge = CHALLENGES[challengeIdx];
  const showChallenge =
    currentChallenge && minute >= currentChallenge.minute && challengeAnswer === null && !burnt;

  const advance = useCallback(() => {
    setEventIdx((prev) => {
      const next = prev + 1;
      if (next >= REPLAY_EVENTS.length) {
        setPlaying(false);
        setCompleted(true);
        return prev;
      }
      const evt = REPLAY_EVENTS[next];
      setHomeScore(evt.homeScore);
      setAwayScore(evt.awayScore);
      setMinute(evt.min);
      setBurnt(false);
      return next;
    });
  }, []);

  useEffect(() => {
    if (!playing || completed) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }
    const delay = 3000 / speed;
    timerRef.current = setTimeout(advance, delay);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [playing, eventIdx, speed, completed, advance]);

  function handlePlay() {
    if (completed) {
      setCompleted(false);
      setEventIdx(-1);
      setHomeScore(0);
      setAwayScore(0);
      setMinute(0);
      setChallengeIdx(0);
      setChallengeAnswer(null);
      setStreak(0);
      setReactions(Object.fromEntries(REACTIONS.map((r) => [r.id, 0])));
      setBurnt(false);
    }
    setPlaying(true);
  }

  function handlePause() {
    setPlaying(false);
  }

  function handleSpeed(s: number) {
    setSpeed(s);
  }

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

  function handleChallengeAnswer(optIdx: number) {
    setChallengeAnswer(optIdx);
    if (optIdx === currentChallenge.correct) setStreak((s) => s + 1);
    setBurnt(true);
  }

  const currentEvent = eventIdx >= 0 ? REPLAY_EVENTS[eventIdx] : null;

  return (
    <div className="flex flex-col gap-4 px-4 pt-4">
      <Link href="/app/matches" className="text-xs text-text-secondary/60 hover:text-text-primary">
        ← Matches
      </Link>

      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold">Demo Replay</h1>
        <span className="rounded-full border border-violet/30 bg-violet/5 px-2.5 py-0.5 text-[10px] font-medium text-violet">
          REPLAY
        </span>
      </div>

      <p className="text-xs leading-relaxed text-text-secondary">
        This replay uses historical/demo match events to show how PulseCup works when no live match is active.
      </p>

      {/* Scoreboard */}
      <div className="glass-elevated px-4 py-4">
        <div className="flex items-center justify-center gap-6">
          <div className="flex flex-col items-center gap-1">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-surface text-xs font-bold text-text-secondary">
              NC
            </div>
            <span className="text-[10px] text-text-secondary">North City</span>
          </div>
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-3xl font-bold">{homeScore} - {awayScore}</span>
            <span className="font-mono text-xs text-text-secondary/50">{minute}'</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-surface text-xs font-bold text-text-secondary">
              SC
            </div>
            <span className="text-[10px] text-text-secondary">South Coast</span>
          </div>
        </div>

        {/* Controls */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePlay}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-coral/20 text-xs text-coral transition-all hover:bg-coral/30 disabled:opacity-30"
              disabled={playing || completed}
            >
              ▶
            </button>
            <button
              onClick={handlePause}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-surface text-xs text-text-secondary transition-all hover:bg-elevated disabled:opacity-30"
              disabled={!playing}
            >
              ⏸
            </button>
            <button
              onClick={() => {
                setEventIdx(-1);
                setHomeScore(0);
                setAwayScore(0);
                setMinute(0);
                setChallengeIdx(0);
                setChallengeAnswer(null);
                setStreak(0);
                setReactions(Object.fromEntries(REACTIONS.map((r) => [r.id, 0])));
                setCompleted(false);
                setPlaying(false);
                setBurnt(false);
              }}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-surface text-xs text-text-secondary transition-all hover:bg-elevated"
            >
              ↺
            </button>
          </div>
          <div className="flex items-center gap-1">
            {[2, 4, 8, 16].map((s) => (
              <button
                key={s}
                onClick={() => handleSpeed(s)}
                className={`cursor-pointer rounded-md px-2 py-1 text-[10px] font-mono transition-all ${
                  speed === s
                    ? "bg-coral/15 text-coral"
                    : "text-text-secondary/40 hover:bg-surface hover:text-text-secondary"
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Streak */}
      <div className="flex items-center justify-center gap-2 text-sm">
        <span className="text-gold">🔥</span>
        <span className="font-semibold text-gold">Streak: {streak}</span>
      </div>

      {/* Current event */}
      {currentEvent && !showChallenge && !completed && (
        <div className="glass-elevated px-4 py-3 text-center">
          <p className="text-sm">
            <span className="font-mono text-text-secondary/50">{minute}'</span>{" "}
            {currentEvent.label}
          </p>
        </div>
      )}

      {/* Challenge */}
      {showChallenge && (
        <div className="glass-elevated border border-coral/20 px-4 py-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-medium uppercase tracking-wider text-coral">
              Challenge
            </span>
            <span className="text-[10px] text-text-secondary/50">
              {challengeIdx + 1}/{CHALLENGES.length}
            </span>
          </div>
          <p className="mt-2 text-sm">{currentChallenge.prompt}</p>
          <div className="mt-3 flex gap-2">
            {currentChallenge.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleChallengeAnswer(i)}
                className={`flex-1 rounded-lg border px-3 py-2 text-xs font-medium transition-all active:scale-[0.97] ${
                  challengeAnswer !== null
                    ? i === currentChallenge.correct
                      ? "border-mint/30 bg-mint/10 text-mint"
                      : challengeAnswer === i
                        ? "border-coral/30 bg-coral/10 text-coral"
                        : "border-border text-text-secondary/30"
                    : "border-border text-text-secondary hover:bg-surface"
                }`}
                disabled={challengeAnswer !== null}
              >
                {opt}
              </button>
            ))}
          </div>
          {challengeAnswer !== null && (
            <p className="mt-2 text-center text-[10px] text-text-secondary/60">
              {challengeAnswer === currentChallenge.correct ? "✅ Correct!" : "❌ Wrong!"}
            </p>
          )}
        </div>
      )}

      {/* Reactions */}
      <div className="glass-elevated px-4 py-4">
        <span className="text-[11px] font-medium text-text-secondary">React</span>
        <div className="relative mt-2 overflow-hidden">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {bursts.map((b) => (
              <span
                key={b.id}
                className="absolute animate-float-up text-lg opacity-0"
                style={{ left: `${b.x}%`, bottom: "10%" }}
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

      {/* Completed */}
      {completed && (
        <div className="glass-elevated border border-gold/20 px-4 py-6 text-center">
          <span className="text-2xl">🏆</span>
          <p className="mt-2 text-sm font-semibold text-gold">Match Complete</p>
          <p className="mt-1 text-xs text-text-secondary/60">
            Final: {homeScore} - {awayScore} · Streak: {streak} · Total reactions:{" "}
            {Object.values(reactions).reduce((a, b) => a + b, 0)}
          </p>
          <div className="mt-4 flex justify-center gap-3">
            <button
              onClick={handlePlay}
              className="rounded-lg bg-coral/20 px-4 py-2 text-xs font-semibold text-coral transition-all hover:bg-coral/30"
            >
              🔄 Replay
            </button>
            <Link
              href="/app/matches"
              className="rounded-lg border border-border px-4 py-2 text-xs text-text-secondary transition-all hover:bg-surface"
            >
              More Matches
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
