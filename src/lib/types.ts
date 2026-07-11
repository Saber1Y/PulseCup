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
  status: string;
}

export interface TxLINERawEvent {
  FixtureId: number;
  Seq: number;
  StatusId?: number;
  GameState?: string;
  Score?: {
    Participant1?: { Total?: { Goals?: number } };
    Participant2?: { Total?: { Goals?: number } };
  };
  Clock?: { Seconds?: number };
}

export interface TxLINEScoreSnapshot {
  fixture_id: number;
  seq: number;
  status: string;
  home_score: number;
  away_score: number;
  period: string;
}

export interface PulseMatchEvent {
  id: string;
  fixtureId: number;
  type: "GOAL" | "CARD" | "CORNER" | "SCORE_UPDATE" | "PHASE_CHANGE";
  minute: number;
  team?: "HOME" | "AWAY";
  homeScore: number;
  awayScore: number;
  label: string;
  timestamp: string;
}

export type ChallengeType =
  | "NEXT_GOAL"
  | "NEXT_EVENT"
  | "TOTAL_GOALS"
  | "NEXT_CORNER";

export interface Challenge {
  id: string;
  fixtureId: number;
  prompt: string;
  type: ChallengeType;
  options: string[];
  status: "OPEN" | "LOCKED" | "RESOLVED";
  correctOption?: string;
}

export type ReactionEmoji = "fire" | "shock" | "skull" | "ice";

export interface ReactionOption {
  emoji: ReactionEmoji;
  label: string;
}
