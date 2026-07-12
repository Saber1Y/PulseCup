import type {
  UserReaction,
  Challenge,
  ChallengeEntry,
  UserStreak,
  PulseCupEvent,
  RecapCard,
} from "../types";

export interface RecapInput {
  profileId: string;
  fixtureId: number;
  homeTeam: string;
  awayTeam: string;
  finalEvent: PulseCupEvent | null;
  reactions: UserReaction[];
  challenges: Challenge[];
  entries: ChallengeEntry[];
  streak: UserStreak;
}

export function generateRecap(input: RecapInput): RecapCard {
  const { profileId, fixtureId, homeTeam, awayTeam, finalEvent, reactions, challenges, entries, streak } = input;

  const homeScore = finalEvent?.homeScore ?? 0;
  const awayScore = finalEvent?.awayScore ?? 0;

  const correctCount = entries.filter((e) => {
    const ch = challenges.find((c) => c.id === e.challengeId);
    return ch?.status === "CORRECT" && e.selectedOption === ch.correctOptionIndex;
  }).length;

  const totalChallenges = entries.length;
  const correctStr = `${correctCount}/${totalChallenges}`;

  const fastestMs = streak.fastestReactionMs;
  const fastestStr = fastestMs != null ? `${(fastestMs / 1000).toFixed(1)}s` : "—";

  const mood = streak.mood;

  const reactionCounts = reactions.reduce<Record<string, number>>((acc, r) => {
    acc[r.reactionId] = (acc[r.reactionId] || 0) + 1;
    return acc;
  }, {});

  const dominantReaction = Object.entries(reactionCounts).sort(
    (a, b) => b[1] - a[1],
  )[0]?.[0] ?? "calm";

  const moodLabel = dominantReaction === "called-it"
    ? "Clairvoyant"
    : dominantReaction === "shocked"
      ? "Shock Jockey"
      : dominantReaction === "over"
        ? "Doomer"
        : "Ice Cold";

  const card: RecapCard = {
    id: `recap-${profileId}-${fixtureId}-${Date.now()}`,
    profileId,
    fixtureId,
    homeTeam,
    awayTeam,
    homeScore,
    awayScore,
    bestStreak: streak.best,
    correctCalls: correctStr,
    fastestReaction: fastestStr,
    mood: moodLabel,
    totalReactions: reactions.length,
    createdAt: new Date().toISOString(),
  };

  return card;
}
