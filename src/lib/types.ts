/* ─── TxLINE raw types ─── */
export interface TxLINEFixtureRaw {
  FixtureId: number;
  CompetitionId: number;
  Competition: string;
  Participant1: string;
  Participant2: string;
  StartTime: number;
}

export interface TxLINEFixture {
  id: number;
  competitionId: number;
  competition: string;
  homeTeam: string;
  awayTeam: string;
  startDate: string;
  status: "live" | "upcoming" | "finished";
}

export interface TxLINERawEvent {
  FixtureId: number;
  Seq: number;
  StatusId?: number;
  GameState?: string;
  Action?: string;
  Data?: { Action?: string };
  Participant?: string;
  Stats?: Record<string, number>;
  Ts?: number;
  Score?: {
    Participant1?: { Total?: { Goals?: number } };
    Participant2?: { Total?: { Goals?: number } };
  };
  Clock?: { Seconds?: number };
}

/* ─── Normalized PulseCup event ─── */
export type PulseEventType =
  | "MATCH_STARTED"
  | "GOAL"
  | "YELLOW_CARD"
  | "RED_CARD"
  | "CORNER"
  | "SUBSTITUTION"
  | "SCORE_UPDATE"
  | "MATCH_ENDED"
  | "SHOT"
  | "FREE_KICK"
  | "POSSESSION"
  | "OTHER";

export interface PulseCupEvent {
  id: string;
  fixtureId: number;
  type: PulseEventType;
  minute: number;
  team?: "HOME" | "AWAY";
  homeScore: number;
  awayScore: number;
  txlineSequence: number;
  action: string;
  raw: unknown;
  createdAt: string;
}

/* ─── Reaction ─── */
export type ReactionId = "called-it" | "shocked" | "over" | "calm";

export interface ReactionOption {
  id: ReactionId;
  emoji: string;
  label: string;
}

export interface UserReaction {
  id: string;
  fixtureId: number;
  profileId: string;
  reactionId: ReactionId;
  eventId: string;
  createdAt: string;
}

/* ─── Challenge ─── */
export type ChallengeType =
  | "NEXT_GOAL"
  | "TOTAL_GOALS_REACH_3"
  | "NEXT_MAJOR_EVENT";

export type ChallengeStatus = "OPEN" | "LOCKED" | "CORRECT" | "WRONG";

export interface Challenge {
  id: string;
  fixtureId: number;
  type: ChallengeType;
  prompt: string;
  options: string[];
  status: ChallengeStatus;
  correctOptionIndex: number | null;
  triggerEventId: string | null;
  createdByEventId: string;
  createdAt: string;
  resolvedAt: string | null;
}

export interface ChallengeEntry {
  id: string;
  profileId: string;
  challengeId: string;
  selectedOption: number;
  createdAt: string;
}

/* ─── Streak ─── */
export interface UserStreak {
  profileId: string;
  fixtureId: number;
  current: number;
  best: number;
  correctCount: number;
  totalAnswered: number;
  fastestReactionMs: number | null;
  mood: string;
}

/* ─── Recap ─── */
export interface RecapCard {
  id: string;
  profileId: string;
  fixtureId: number;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  bestStreak: number;
  correctCalls: string;
  fastestReaction: string;
  mood: string;
  totalReactions: number;
  createdAt: string;
}

/* ─── Moment engine types ─── */
export interface ReactionPrompt {
  title: string;
  body: string;
  options: ReactionOption[];
}

export interface ChallengePrompt {
  type: ChallengeType;
  prompt: string;
  options: string[];
}

export interface GeneratedMoment {
  reactionPrompt: ReactionPrompt | null;
  challenge: ChallengePrompt | null;
}
