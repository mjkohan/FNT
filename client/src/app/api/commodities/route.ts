import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // Available commodities
    const commodities = [
      {
        symbol: "gold",
        description: "Gold Futures",
        displaySymbol: "GOLD",
        tvSymbol: "GOLD"
      },
      {
        symbol: "platinum",
        description: "Platinum",
        displaySymbol: "PLATINUM",
        tvSymbol: "PLATINUM"
      },
      {
        symbol: "lean_hogs",
        description: "Lean Hogs Futures",
        displaySymbol: "LEAN_HOGS",
        tvSymbol: "LEANHOGS"
      },
      // {
      //   symbol: "oat",
      //   description: "Oat Futures",
      //   displaySymbol: "OAT",
      //   tvSymbol: "OAT"
      // },
      {
        symbol: "aluminum",
        description: "Aluminum Futures",
        displaySymbol: "ALUMINUM",
        tvSymbol: "ALUMINUM"
      },
      {
        symbol: "soybean_meal",
        description: "Soybean Meal Futures",
        displaySymbol: "SOYBEAN_MEAL",
        tvSymbol: "SOYBEANMEAL"
      },
      {
        symbol: "lumber",
        description: "Lumber Futures",
        displaySymbol: "LUMBER",
        tvSymbol: "LUMBER"
      },
      // {
      //   symbol: "micro_gold",
      //   description: "Micro Gold Futures",
      //   displaySymbol: "MICRO_GOLD",
      //   tvSymbol: "MICROGOLD"
      // },
      {
        symbol: "feeder_cattle",
        description: "Feeder Cattle Futures",
        displaySymbol: "FEEDER_CATTLE",
        tvSymbol: "FEEDERCATTLE"
      },
      // {
      //   symbol: "rough_rice",
      //   description: "Rough Rice Futures",
      //   displaySymbol: "ROUGH_RICE",
      //   tvSymbol: "RICE"
      // },
      {
        symbol: "palladium",
        description: "Palladium",
        displaySymbol: "PALLADIUM",
        tvSymbol: "PALLADIUM"
      }
    ];
    
    

    return NextResponse.json(commodities);
  } catch (e) {
    console.error("Commodities API error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
