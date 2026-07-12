import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { profileId, fixtureId, eventId, reactionId } = body;

    if (!profileId || !fixtureId || !eventId || !reactionId) {
      return NextResponse.json({ error: "profileId, fixtureId, eventId, reactionId required" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("reactions")
      .insert({
        profile_id: profileId,
        fixture_id: fixtureId,
        event_id: eventId,
        reaction_id: reactionId,
      })
      .select()
      .single();

    if (error) {
      console.error("POST /api/reactions supabase error:", error);
      return NextResponse.json({ error: "Failed to store reaction" }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("POST /api/reactions error:", err);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const fixtureId = url.searchParams.get("fixtureId");

  if (!fixtureId) {
    return NextResponse.json({ error: "fixtureId required" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("reactions")
    .select("*")
    .eq("fixture_id", Number(fixtureId))
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "Failed to fetch reactions" }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}
