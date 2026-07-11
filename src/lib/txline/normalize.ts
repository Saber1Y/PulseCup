import type { TxLINERawEvent, TxLINEScoreSnapshot } from "../types";

export function parseScoreSnapshot(raw: TxLINERawEvent[]): TxLINEScoreSnapshot | null {
  if (!Array.isArray(raw) || raw.length === 0) return null;

  const sorted = [...raw].sort((a, b) => b.Seq - a.Seq);
  const event = sorted[0];
  const score = event.Score;

  const homeScore = score?.Participant1?.Total?.Goals ?? 0;
  const awayScore = score?.Participant2?.Total?.Goals ?? 0;
  const seconds = event.Clock?.Seconds ?? 0;

  const statusId = event.StatusId;
  const status = statusId === 5 || statusId === 7 || statusId === 9
    ? "finished"
    : statusId === 4 || statusId === 3 || statusId === 2
      ? "live"
      : "scheduled";

  return {
    fixture_id: event.FixtureId,
    seq: event.Seq,
    status,
    home_score: homeScore,
    away_score: awayScore,
    period: seconds > 0 ? `${Math.floor(seconds / 60)}'` : "0'",
  };
}
