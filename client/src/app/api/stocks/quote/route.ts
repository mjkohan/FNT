import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // Get search params
    const { searchParams } = new URL(req.url);
    const symbol = searchParams.get("symbol");

    if (!symbol) {
      return NextResponse.json({ error: "Symbol parameter is required" }, { status: 400 });
    }
    // Fetch quote from Finnhub
    const res = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${process.env.FINNHUB_API_KEY}`,
      {
        headers: { "Accept": "application/json" },
        next: { revalidate: 60 }, // cache for 1 minute
      }
    );

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch quote data" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
