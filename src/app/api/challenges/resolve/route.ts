import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { normalizeTxLINEArray } from "@/lib/txline/normalize-event";
import { resolveChallenge } from "@/lib/pulse/challenge-engine";
import type { Challenge } from "@/lib/types";

export const dynamic = "force-dynamic";

// POST /api/challenges/resolve — try to resolve open challenges with a new event
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fixtureId, rawEvents } = body;

    if (!fixtureId || !rawEvents) {
      return NextResponse.json({ error: "fixtureId and rawEvents required" }, { status: 400 });
    }

    const events = normalizeTxLINEArray(rawEvents);
    if (events.length === 0) {
      return NextResponse.json({ resolved: [] });
    }

    const supabase = getSupabaseAdmin();

    // Fetch open challenges for this fixture
    const { data: openChallenges } = await supabase
      .from("challenges")
      .select("*")
      .eq("fixture_id", fixtureId)
      .eq("status", "OPEN");

    if (!openChallenges || openChallenges.length === 0) {
      return NextResponse.json({ resolved: [] });
    }

    const castChallenges: Challenge[] = openChallenges.map((c: any) => ({
      id: c.id,
      fixtureId: c.fixture_id,
      type: c.challenge_type,
      prompt: c.prompt,
      options: c.options,
      status: "OPEN",
      correctOptionIndex: c.correct_option_index,
      triggerEventId: c.trigger_event_id,
      createdByEventId: c.created_by_event_id,
      createdAt: c.created_at,
      resolvedAt: c.resolved_at,
    }));

    const resolved: any[] = [];

    for (const ch of castChallenges) {
      for (const evt of events) {
        const result = resolveChallenge(ch, evt);
        if (result && result.status !== ch.status) {
          const { error } = await supabase
            .from("challenges")
            .update({
              status: result.status,
              correct_option_index: result.correctOptionIndex,
              resolved_at: result.resolvedAt,
            })
            .eq("id", ch.id);

          if (!error) {
            resolved.push({ challengeId: ch.id, status: result.status });
          }
          break;
        }
      }
    }

    return NextResponse.json({ resolved });
  } catch (err) {
    console.error("POST /api/challenges/resolve error:", err);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
