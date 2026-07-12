"use client";

import type { UserStreak } from "@/lib/types";

interface Props {
  streak: UserStreak | null;
}

const MOOD_COLORS: Record<string, string> = {
  Legend: "text-gold",
  "Chaos Merchant": "text-coral",
  "Sharp Eye": "text-violet",
  "Getting Warm": "text-mint",
  "Casual Fan": "text-text-secondary",
};

export function StreakBar({ streak }: Props) {
  if (!streak || streak.totalAnswered === 0) {
    return (
      <div className="glass-elevated px-4 py-4">
        <span className="text-[11px] font-medium text-text-secondary">Streak</span>
        <p className="mt-1 text-xs text-text-secondary/50">
          Your streak appears after answering challenges.
        </p>
      </div>
    );
  }

  const moodColor = MOOD_COLORS[streak.mood] ?? "text-text-secondary";
  const pct = streak.totalAnswered > 0
    ? Math.round((streak.correctCount / streak.totalAnswered) * 100)
    : 0;

  return (
    <div className="glass-elevated px-4 py-4">
      <span className="text-[11px] font-medium text-text-secondary">Streak</span>

      <div className="mt-3 grid grid-cols-3 gap-3">
        <div className="flex flex-col items-center rounded-xl bg-white/[4%] px-3 py-2.5">
          <span className="text-xl font-bold text-text-primary">{streak.current}</span>
          <span className="text-[10px] text-text-secondary/50">Current</span>
        </div>
        <div className="flex flex-col items-center rounded-xl bg-white/[4%] px-3 py-2.5">
          <span className="text-xl font-bold text-text-primary">{streak.best}</span>
          <span className="text-[10px] text-text-secondary/50">Best</span>
        </div>
        <div className="flex flex-col items-center rounded-xl bg-white/[4%] px-3 py-2.5">
          <span className={`text-xl font-bold ${moodColor}`}>{streak.mood}</span>
          <span className="text-[10px] text-text-secondary/50">Mood</span>
        </div>
      </div>

      <div className="mt-3">
        <div className="flex items-center justify-between text-[10px] text-text-secondary/50">
          <span>{streak.correctCount}/{streak.totalAnswered} correct</span>
          <span>{pct}%</span>
        </div>
        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/[6%]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-coral to-violet transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {streak.fastestReactionMs != null && (
        <p className="mt-2 text-center text-[10px] text-text-secondary/40">
          Fastest reaction: {(streak.fastestReactionMs / 1000).toFixed(1)}s
        </p>
      )}
    </div>
  );
}
