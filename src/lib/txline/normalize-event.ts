import type { TxLINERawEvent, PulseCupEvent, PulseEventType } from "../types";

const ACTION_MAP: Record<string, PulseEventType> = {
  goal: "GOAL",
  yellow_card: "YELLOW_CARD",
  unreliable_yellow_cards: "YELLOW_CARD",
  red_card: "RED_CARD",
  corner: "CORNER",
  game_finalised: "MATCH_ENDED",
  shot: "SHOT",
  free_kick: "FREE_KICK",
  attack_possession: "POSSESSION",
  danger_possession: "POSSESSION",
  high_danger_possession: "POSSESSION",
  safe_possession: "POSSESSION",
  possession: "POSSESSION",
};

const GAME_STATE_FALLBACK: Record<string, PulseEventType> = {
  "Kick off": "MATCH_STARTED",
  "Goal": "GOAL",
  "Yellow Card": "YELLOW_CARD",
  "Red Card": "RED_CARD",
  "Corner": "CORNER",
  "Substitution": "SUBSTITUTION",
  "Full Time": "MATCH_ENDED",
};

const STATUS_ID_FALLBACK: Record<number, PulseEventType> = {
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
  const participant = raw.Participant;
  if (participant != null) {
    const lower = String(participant).toLowerCase();
    if (lower.includes("home") || lower === "1") return "HOME";
    if (lower.includes("away") || lower === "2") return "AWAY";
  }
  const state = raw.GameState;
  if (state) {
    const lower = state.toLowerCase();
    if (lower.includes("home") || lower.includes("participant1")) return "HOME";
    if (lower.includes("away") || lower.includes("participant2")) return "AWAY";
  }
  return undefined;
}

export function normalizeTxLINE(raw: TxLINERawEvent): PulseCupEvent | null {
  const fixtureId = raw.FixtureId;
  const seq = raw.Seq;

  if (!fixtureId || seq == null) return null;

  const action = String(raw.Action ?? raw.Data?.Action ?? "").trim().toLowerCase();
  const gameState = raw.GameState ?? "";

  const eventType =
    ACTION_MAP[action] ??
    GAME_STATE_FALLBACK[gameState] ??
    STATUS_ID_FALLBACK[raw.StatusId ?? -1] ??
    "OTHER";

  const stats = raw.Stats;
  const score = raw.Score;
  const homeScore = stats?.["1"] ?? score?.Participant1?.Total?.Goals ?? 0;
  const awayScore = stats?.["2"] ?? score?.Participant2?.Total?.Goals ?? 0;
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
    action,
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
