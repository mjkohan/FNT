import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const symbol = searchParams.get("symbol");
    
    if (!symbol) {
      return NextResponse.json({ error: "symbol parameter is required" }, { status: 400 });
    }

    // Fetch quote data from Financial Modeling Prep
    const quoteRes = await fetch(
      `https://financialmodelingprep.com/stable/quote?symbol=${symbol}&apikey=${process.env.FMP_API_KEY}`,
      {
        headers: { "Accept": "application/json" },
        next: { revalidate: 60 }, // cache for 1 minute
      }
    );

    if (!quoteRes.ok) {
      return NextResponse.json({ error: "Failed to fetch commodity data" }, { status: quoteRes.status });
    }

    const quoteData = await quoteRes.json();

    return NextResponse.json(quoteData);
  } catch (e) {
    console.error("Commodities API error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

