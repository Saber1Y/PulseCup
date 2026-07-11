import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// GET /api/replay/[fixtureId] — fetch historical TxLINE data for replay
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ fixtureId: string }> }
) {
  const { fixtureId } = await params;
  const txlineBase = process.env.TXLINE_BASE_URL || "https://txline.dev";
  const jwt = process.env.TXLINE_JWT;
  const apiToken = process.env.TXLINE_API_TOKEN;

  try {
    const res = await fetch(`${txlineBase}/api/scores/historical/${fixtureId}`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
        "X-Api-Token": apiToken || "",
      },
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `TxLINE returned ${res.status}` },
        { status: 502 }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error(`GET /api/replay/${fixtureId} error:`, err);
    return NextResponse.json({ error: "Failed to fetch replay data" }, { status: 502 });
  }
}
