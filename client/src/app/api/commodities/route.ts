import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Available commodities
    const commodities = [
      {
        name: "gold",
        symbol: "GCUSD",
        description: "Gold Futures",
        displaySymbol: "GOLD",
        tvSymbol: "GOLD"
      },
      {
        name: "sp500",
        symbol: "ESUSD",
        description: "E-Mini S&P 500 Futures",
        displaySymbol: "SP500",
        tvSymbol: "SP500"
      },
      {
        name: "silver",
        symbol: "SIUSD",
        description: "Silver Futures",
        displaySymbol: "SILVER",
        tvSymbol: "SILVER"
      },
      {
        name: "brent_crude",
        symbol: "BZUSD",
        description: "Brent Crude Oil Futures",
        displaySymbol: "BRENT",
        tvSymbol: "BRENT"
      }
    ];
    
    
    

    return NextResponse.json(commodities);
  } catch (e) {
    console.error("Commodities API error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
