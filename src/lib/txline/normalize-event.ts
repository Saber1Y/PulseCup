import type { TxLINERawEvent, PulseCupEvent, PulseEventType } from "../types";

const GAME_STATE_MAP: Record<string, PulseEventType> = {
  "Kick off": "MATCH_STARTED",
  "Goal": "GOAL",
  "Yellow Card": "YELLOW_CARD",
  "Red Card": "RED_CARD",
  "Corner": "CORNER",
  "Substitution": "SUBSTITUTION",
  "Full Time": "MATCH_ENDED",
};

const STATUS_ID_MAP: Record<number, PulseEventType> = {
  1: "MATCH_STARTED",
  5: "MATCH_ENDED",
  7: "MATCH_ENDED",
  9: "MATCH_ENDED",
};

let sequenceCounter = 0;

function nextId(): string {
  sequenceCounter++;
  return `evt-${Date.now()}-${sequenceCounter}-${Math.random().toString(36).slice(2, 6)}`;
}

function determineTeam(raw: TxLINERawEvent): "HOME" | "AWAY" | undefined {
  const state = raw.GameState;
  if (!state) return undefined;
  const lower = state.toLowerCase();
  if (lower.includes("home") || lower.includes("participant1")) return "HOME";
  if (lower.includes("away") || lower.includes("participant2")) return "AWAY";
  return undefined;
}

export function normalizeTxLINE(raw: TxLINERawEvent): PulseCupEvent | null {
  const fixtureId = raw.FixtureId;
  const seq = raw.Seq;

  if (!fixtureId || seq == null) return null;

  const eventType =
    GAME_STATE_MAP[raw.GameState ?? ""] ??
    STATUS_ID_MAP[raw.StatusId ?? -1] ??
    "SCORE_UPDATE";

  const score = raw.Score;
  const homeScore = score?.Participant1?.Total?.Goals ?? 0;
  const awayScore = score?.Participant2?.Total?.Goals ?? 0;
  const seconds = raw.Clock?.Seconds ?? 0;
  const minute = Math.floor(seconds / 60);

  return {
    id: nextId(),
    fixtureId,
    type: eventType,
    minute,
    team: determineTeam(raw),
    homeScore,
    awayScore,
    txlineSequence: seq,
    raw,
    createdAt: new Date().toISOString(),
  };
}

export function normalizeTxLINEArray(rawArray: unknown): PulseCupEvent[] {
  if (!Array.isArray(rawArray)) return [];
  return rawArray
    .map((item) => normalizeTxLINE(item as TxLINERawEvent))
    .filter((e): e is PulseCupEvent => e !== null);
}
