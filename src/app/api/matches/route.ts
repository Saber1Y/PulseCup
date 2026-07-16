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

    const rawFixtures: any[] = [];

    if (res.ok) {
      const raw: unknown = await res.json();
      if (Array.isArray(raw)) {
        // Only consider World Cup fixtures
        const wc = raw.filter((f: Record<string, unknown>) => f.CompetitionId === 72);

        // Check which fixtures actually have meaningful event data
        const results = await Promise.allSettled(
          wc.map(async (f: Record<string, unknown>) => {
            const fid = f.FixtureId;
            const scoreRes = await fetch(
              `${TXLINE_BASE}/api/scores/snapshot/${fid}`,
              { headers: headers(), signal: AbortSignal.timeout(5000) },
            );
            if (!scoreRes.ok) throw new Error("no data");
            const events: unknown = await scoreRes.json();
            const count = Array.isArray(events) ? events.length : 0;
            if (count <= 2) throw new Error("placeholder");
            return {
              id: fid ?? 0,
              competitionId: f.CompetitionId ?? 0,
              competition: f.Competition ?? "World Cup",
              homeTeam: f.Participant1 ?? "Home",
              awayTeam: f.Participant2 ?? "Away",
              startDate: new Date((f.StartTime as number) || Date.now()).toISOString(),
              status: (f.StartTime as number) > Date.now() ? "upcoming" : "finished",
            };
          }),
        );

        for (const r of results) {
          if (r.status === "fulfilled") rawFixtures.push(r.value);
        }
      }
    }

    // Merge in known replay fixtures (dedup by id)
    const existingIds = new Set(rawFixtures.map((f: any) => f.id));
    for (const kf of KNOWN_REPLAY_FIXTURES) {
      if (!existingIds.has(kf.id)) {
        rawFixtures.push({ ...kf, status: "finished" });
      }
    }

    return NextResponse.json(rawFixtures);
  } catch (err) {
    return NextResponse.json(KNOWN_REPLAY_FIXTURES.map((f) => ({ ...f, status: "finished" })));
  }
}
