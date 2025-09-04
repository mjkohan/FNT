import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const symbol = searchParams.get("symbol");

    if (!symbol) {
        return NextResponse.json({ error: "symbol parameter is required" }, { status: 400 });
    }

    // Fetch commodity price from API Ninjas
    const rateRes = await fetch(
      `https://api.api-ninjas.com/v1/commodityprice?name=${symbol}`,
      {
        headers: { 
          "Accept": "application/json",
          "X-Api-Key": process.env.NINJA_API_KEY || ""
        },
        next: { revalidate: 600 }, // cache for 1 minute
      }
    );

    if (!rateRes.ok) {
      return NextResponse.json({ error: "Failed to fetch commodity price" }, { status: rateRes.status });
    }

    const rateData = await rateRes.json();

    return NextResponse.json(rateData);
  } catch (e) {
    console.error("Commodities rate API error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
