import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import type { Challenge } from "@/lib/types";

export const dynamic = "force-dynamic";

function parsePulseEvent(body: any) {
  return {
    id: body.eventId,
    fixtureId: body.fixtureId,
    type: body.eventType,
    minute: body.minute ?? 0,
    team: body.team ?? null,
    homeScore: body.homeScore ?? 0,
    awayScore: body.awayScore ?? 0,
    txlineSequence: body.txlineSequence ?? 0,
    raw: body.raw ?? null,
    createdAt: new Date().toISOString(),
  };
}

// POST /api/challenges — create one or more challenges from a PulseCupEvent
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const challenges = body.challenges as Challenge[];

    if (!Array.isArray(challenges) || challenges.length === 0) {
      return NextResponse.json({ error: "challenges array required" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("challenges")
      .insert(
        challenges.map((c) => ({
          id: c.id,
          fixture_id: c.fixtureId,
          challenge_type: c.type,
          prompt: c.prompt,
          options: c.options,
          status: c.status,
          correct_option_index: c.correctOptionIndex,
          trigger_event_id: c.triggerEventId,
          created_by_event_id: c.createdByEventId,
        })),
      )
      .select();

    if (error) {
      console.error("POST /api/challenges supabase error:", error);
      return NextResponse.json({ error: "Failed to store challenges" }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("POST /api/challenges error:", err);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

// GET /api/challenges?fixtureId=&status=OPEN
export async function GET(req: Request) {
  const url = new URL(req.url);
  const fixtureId = url.searchParams.get("fixtureId");
  const status = url.searchParams.get("status");

  if (!fixtureId) {
    return NextResponse.json({ error: "fixtureId required" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  let query = supabase
    .from("challenges")
    .select("*")
    .eq("fixture_id", Number(fixtureId))
    .order("created_at", { ascending: false });

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: "Failed to fetch challenges" }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}
