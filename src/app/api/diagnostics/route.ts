import { NextRequest, NextResponse } from "next/server";

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

async function fetchEndpoint(label: string, url: string) {
  const start = Date.now();
  try {
    const res = await fetch(url, { headers: headers(), signal: AbortSignal.timeout(10000) });
    const elapsed = Date.now() - start;
    if (!res.ok) {
      return { label, url, status: res.status, statusText: res.statusText, elapsed, error: `HTTP ${res.status}`, raw: null };
    }
    const text = await res.text();
    let parsed: unknown = null;
    try { parsed = JSON.parse(text); } catch { parsed = text; }
    return { label, url, status: res.status, elapsed, error: null, raw: parsed };
  } catch (err: unknown) {
    const elapsed = Date.now() - start;
    return { label, url, status: 0, elapsed, error: err instanceof Error ? err.message : String(err), raw: null };
  }
}

function summarize(records: unknown[], label: string) {
  if (!Array.isArray(records) || records.length === 0) {
    return { endpoint: label, totalEvents: 0, gameStates: [], actions: [], mapping: { GOAL: false, YELLOW_CARD: false, RED_CARD: false, CORNER: false, MATCH_ENDED: false }, sampleKeys: [] };
  }

  const gameStates = new Set<string>();
  const actions = new Set<string>();
  const sampleKeys = new Set<string>();

  for (const r of records) {
    if (r && typeof r === "object") {
      if ("GameState" in r) gameStates.add(String((r as any).GameState ?? ""));
      if ("gameState" in r) gameStates.add(String((r as any).gameState ?? ""));
      if ("Action" in r) actions.add(String((r as any).Action ?? ""));
      if ("action" in r) actions.add(String((r as any).action ?? ""));
      if ("type" in r && r.type !== undefined) actions.add(String(r.type));
      Object.keys(r as any).forEach(k => sampleKeys.add(k));
    }
  }

  const ACTION_TARGETS: Record<string, string[]> = {
    GOAL: ["goal"],
    YELLOW_CARD: ["yellow_card"],
    RED_CARD: ["red_card"],
    CORNER: ["corner"],
    MATCH_ENDED: ["game_finalised", "full time", "finished", "final"],
  };

  const actionList = [...actions].map((a) => a.toLowerCase());

  const mapping: Record<string, boolean> = {};
  for (const [key, targets] of Object.entries(ACTION_TARGETS)) {
    mapping[key] = targets.some((t) => actionList.includes(t) || actionList.some((a) => a.includes(t)));
  }

  return {
    endpoint: label,
    totalEvents: records.length,
    gameStates: [...gameStates].sort(),
    actions: [...actions].sort(),
    sampleKeys: [...sampleKeys].sort(),
    mapping,
  };
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const fixtureId = url.searchParams.get("fixtureId") || "18222446";
  const includeRaw = url.searchParams.get("raw") === "true";

  const [snapshot, historical, fixturesRaw] = await Promise.all([
    fetchEndpoint("snapshot", `${TXLINE_BASE}/api/scores/snapshot/${fixtureId}`),
    fetchEndpoint("historical", `${TXLINE_BASE}/api/scores/historical/${fixtureId}`),
    fetchEndpoint("fixtures", `${TXLINE_BASE}/api/fixtures/snapshot`),
  ]);

  const snapshotSummary = snapshot.raw ? summarize(Array.isArray(snapshot.raw) ? snapshot.raw : [snapshot.raw], "snapshot") : null;
  const historicalSummary = historical.raw ? summarize(Array.isArray(historical.raw) ? historical.raw : [historical.raw], "historical") : null;

  const fixtureList = Array.isArray(fixturesRaw.raw) ? fixturesRaw.raw : [];
  const worldCupFixtures = fixtureList.filter((f: any) => f.CompetitionId === 72).map((f: any) => ({
    id: f.FixtureId,
    home: f.Participant1,
    away: f.Participant2,
    competition: f.Competition,
    startTime: new Date(f.StartTime).toISOString(),
  }));

  const result: Record<string, unknown> = {
    fixtureId,
    txlineBase: TXLINE_BASE,
    endpoints: {
      snapshot,
      historical,
      fixtures: { ...fixturesRaw, raw: undefined },
    },
    worldCupFixtures,
    analysis: {
      snapshot: snapshotSummary,
      historical: historicalSummary,
    },
  };

  if (includeRaw) {
    result.endpoints = { snapshot, historical, fixtures: fixturesRaw };
  }

  return NextResponse.json(result);
}
