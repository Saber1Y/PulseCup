import type { TxLINEFixtureRaw, TxLINEFixture } from "../types";

function headers(): Record<string, string> {
  const jwt = process.env.TXLINE_JWT;
  const apiToken = process.env.TXLINE_API_TOKEN;
  const baseUrl = process.env.TXLINE_BASE_URL || "https://txline.dev";
  return {
    Authorization: `Bearer ${jwt}`,
    "X-Api-Token": apiToken || "",
    "Content-Type": "application/json",
  };
}

function baseUrl(): string {
  return process.env.TXLINE_BASE_URL || "https://txline.dev";
}

export async function fetchFixtures(): Promise<TxLINEFixture[]> {
  const res = await fetch(`${baseUrl()}/api/fixtures/snapshot`, {
    headers: headers(),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`TxLINE ${res.status}`);
  const raw: TxLINEFixtureRaw[] = await res.json();
  return raw.map((f) => ({
    id: f.FixtureId,
    competitionId: f.CompetitionId,
    competition: f.Competition,
    homeTeam: f.Participant1,
    awayTeam: f.Participant2,
    startDate: new Date(f.StartTime).toISOString(),
    status: f.StartTime > Date.now() ? "upcoming" : "finished",
  }));
}

export async function fetchScoreSnapshot(fixtureId: number) {
  const res = await fetch(`${baseUrl()}/api/scores/snapshot/${fixtureId}`, {
    headers: headers(),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) return null;
  return res.json();
}
