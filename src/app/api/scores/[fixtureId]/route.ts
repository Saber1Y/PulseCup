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

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ fixtureId: string }> }
) {
  const { fixtureId } = await params;

  try {
    const res = await fetch(`${TXLINE_BASE}/api/scores/snapshot/${fixtureId}`, {
      headers: headers(),
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      return NextResponse.json(null);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error(`GET /api/scores/${fixtureId} error:`, err);
    return NextResponse.json(null);
  }
}
