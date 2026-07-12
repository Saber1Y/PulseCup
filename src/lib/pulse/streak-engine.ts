import type { UserStreak } from "../types";

export function createStreak(
  profileId: string,
  fixtureId: number,
): UserStreak {
  return {
    profileId,
    fixtureId,
    current: 0,
    best: 0,
    correctCount: 0,
    totalAnswered: 0,
    fastestReactionMs: null,
    mood: "Casual Fan",
  };
}

export function applyCorrectAnswer(
  streak: UserStreak,
  reactionMs: number | null,
): UserStreak {
  const newCurrent = streak.current + 1;
  return {
    ...streak,
    current: newCurrent,
    best: Math.max(streak.best, newCurrent),
    correctCount: streak.correctCount + 1,
    totalAnswered: streak.totalAnswered + 1,
    fastestReactionMs:
      streak.fastestReactionMs == null
        ? reactionMs
        : reactionMs == null
          ? streak.fastestReactionMs
          : Math.min(streak.fastestReactionMs, reactionMs),
    mood: computeMood(newCurrent),
  };
}

export function applyWrongAnswer(
  streak: UserStreak,
): UserStreak {
  return {
    ...streak,
    current: 0,
    totalAnswered: streak.totalAnswered + 1,
    mood: computeMood(0),
  };
}

const MOODS: Array<{ minStreak: number; label: string }> = [
  { minStreak: 10, label: "Legend" },
  { minStreak: 7, label: "Chaos Merchant" },
  { minStreak: 5, label: "Sharp Eye" },
  { minStreak: 3, label: "Getting Warm" },
  { minStreak: 0, label: "Casual Fan" },
];

function computeMood(streak: number): string {
  for (const m of MOODS) {
    if (streak >= m.minStreak) return m.label;
  }
  return "Casual Fan";
}

export function formatStreakMs(ms: number | null): string {
  if (ms == null) return "—";
  return `${(ms / 1000).toFixed(1)}s`;
}
