import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const TXLINE_BASE = process.env.TXLINE_BASE_URL || "https://txline-dev.txodds.com";

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

    if (!res.ok) {
      console.warn(`TxLINE returned ${res.status}`);
      return NextResponse.json([]);
    }

    const raw: unknown = await res.json();

    if (!Array.isArray(raw)) {
      return NextResponse.json([]);
    }

    const fixtures = raw.map((f: Record<string, unknown>) => ({
      id: f.FixtureId ?? 0,
      competitionId: f.CompetitionId ?? 0,
      competition: f.Competition ?? "World Cup",
      homeTeam: f.Participant1 ?? "Home",
      awayTeam: f.Participant2 ?? "Away",
      startDate: new Date((f.StartTime as number) || Date.now()).toISOString(),
      status: (f.StartTime as number) > Date.now() ? "upcoming" : "finished",
    }));

    return NextResponse.json(fixtures);
  } catch (err) {
    console.error("GET /api/matches error:", err);
    return NextResponse.json([]);
  }
}
