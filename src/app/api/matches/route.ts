import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const TXLINE_BASE = process.env.TXLINE_BASE_URL || "https://txline-dev.txodds.com";

// Known replay fixtures not returned by the TxLINE snapshot but verified to have events
const KNOWN_REPLAY_FIXTURES = [
  { id: 18222446, competitionId: 72, competition: "World Cup", homeTeam: "Argentina", awayTeam: "Switzerland", startDate: "2026-07-12T20:00:00.000Z" },
  { id: 18237038, competitionId: 72, competition: "World Cup", homeTeam: "France", awayTeam: "Spain", startDate: "2026-07-14T20:00:00.000Z" },
];

function headers(): Record<string, string> {
  return {
    Authorization: `Bearer ${process.env.TXLINE_JWT || ""}`,
    "X-Api-Token": process.env.TXLINE_API_TOKEN || "",
    "Content-Type": "application/json",
  };
}

export async function GET() {
  try {
    const res = await fetch(`${TXLINE_BASE}/api/fixtures/snapshot`, {
      headers: headers(),
      signal: AbortSignal.timeout(8000),
    });

    let fixtures: any[] = [];

    if (res.ok) {
      const raw: unknown = await res.json();
      if (Array.isArray(raw)) {
        fixtures = raw
          .filter((f: Record<string, unknown>) => f.CompetitionId === 72)
          .map((f: Record<string, unknown>) => ({
            id: f.FixtureId ?? 0,
            competitionId: f.CompetitionId ?? 0,
            competition: f.Competition ?? "World Cup",
            homeTeam: f.Participant1 ?? "Home",
            awayTeam: f.Participant2 ?? "Away",
            startDate: new Date((f.StartTime as number) || Date.now()).toISOString(),
            status: (f.StartTime as number) > Date.now() ? "upcoming" : "finished",
          }));
      }
    }

    // Merge in known replay fixtures (dedup by id)
    const existingIds = new Set(fixtures.map((f: any) => f.id));
    for (const kf of KNOWN_REPLAY_FIXTURES) {
      if (!existingIds.has(kf.id)) {
        fixtures.push({ ...kf, status: "finished" });
      }
    }

    return NextResponse.json(fixtures);
  } catch (err) {
    // Even if TxLINE fails, return known replay fixtures
    return NextResponse.json(KNOWN_REPLAY_FIXTURES.map((f) => ({ ...f, status: "finished" })));
  }
}
