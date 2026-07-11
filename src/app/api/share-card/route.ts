import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// POST /api/share-card — generate a shareable match recap card
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fixtureId, reactions, streak, homeScore, awayScore, sessionId } = body;

    if (!fixtureId) {
      return NextResponse.json({ error: "fixtureId required" }, { status: 400 });
    }

    // TODO: generate an OG image using @vercel/og or similar
    const cardUrl = `/api/share-card/${fixtureId}?streak=${streak || 0}&r=${reactions || 0}&h=${homeScore || 0}&a=${awayScore || 0}`;

    return NextResponse.json({ cardUrl, shareText: `I just finished watching with PulseCup! 🔥 Streak: ${streak}` });
  } catch (err) {
    console.error("POST /api/share-card error:", err);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
