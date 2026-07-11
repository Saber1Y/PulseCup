export interface TxLINEConfig {
  baseUrl: string;
  jwt: string;
  apiToken: string;
}

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

export interface TxLINEScoreSnapshot {
  fixture_id: number;
  seq: number;
  status: string;
  home_score: number;
  away_score: number;
  period: string;
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

export interface TxLINEStreamMessage {
  type: "SCORE_UPDATE" | "EVENT" | "HEARTBEAT";
  fixtureId: number;
  data?: TxLINERawEvent;
}

export interface TxLINEStatValidationRequest {
  fixtureId: number;
  seq: number;
  statKey: number;
  statKey2?: number;
  operator?: string;
}

export interface TxLINEStatValidationResponse {
  result: boolean;
  merkle_root: string;
}
