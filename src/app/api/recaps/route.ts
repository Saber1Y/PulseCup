import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// GET /api/recaps?profileId=&fixtureId=&cardId=
export async function GET(req: Request) {
  const url = new URL(req.url);
  const profileId = url.searchParams.get("profileId");
  const fixtureId = url.searchParams.get("fixtureId");
  const cardId = url.searchParams.get("cardId");

  const supabase = getSupabaseAdmin();

  // Single card lookup
  if (cardId) {
    const { data, error } = await supabase
      .from("recap_cards")
      .select("*")
      .eq("id", cardId)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: "Failed to fetch recap" }, { status: 500 });
    }

    return NextResponse.json(data ? [data] : []);
  }

  if (!profileId) {
    return NextResponse.json({ error: "profileId required" }, { status: 400 });
  }

  let query = supabase
    .from("recap_cards")
    .select("*")
    .eq("profile_id", profileId)
    .order("created_at", { ascending: false });

  if (fixtureId) {
    query = query.eq("fixture_id", Number(fixtureId));
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: "Failed to fetch recaps" }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}

// POST /api/recaps — save a recap card
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, profileId, fixtureId, homeTeam, awayTeam, homeScore, awayScore, bestStreak, correctCalls, fastestReaction, mood, totalReactions } = body;

    if (!profileId || !fixtureId) {
      return NextResponse.json({ error: "profileId and fixtureId required" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("recap_cards")
      .insert({
        id: id || `recap-${profileId}-${fixtureId}-${Date.now()}`,
        profile_id: profileId,
        fixture_id: fixtureId,
        home_team: homeTeam ?? "Home",
        away_team: awayTeam ?? "Away",
        home_score: homeScore ?? 0,
        away_score: awayScore ?? 0,
        best_streak: bestStreak ?? 0,
        correct_calls: correctCalls ?? "0/0",
        fastest_reaction: fastestReaction ?? "—",
        mood: mood ?? "Ice Cold",
        total_reactions: totalReactions ?? 0,
      })
      .select()
      .single();

    if (error) {
      console.error("POST /api/recaps supabase error:", error);
      return NextResponse.json({ error: "Failed to save recap" }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("POST /api/recaps error:", err);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
