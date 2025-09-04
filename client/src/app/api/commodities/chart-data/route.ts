import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const symbol = searchParams.get("symbol");
    const interval = searchParams.get("interval") || "1h"; // Default to 1h if not provided
    
    if (!symbol) {
      return NextResponse.json({ error: "symbol parameter is required" }, { status: 400 });
    }

    // Calculate start time to get exactly 10 candles
    const now = Math.floor(Date.now() / 1000); // Current time in Unix timestamp
    const periodInSeconds = getPeriodInSeconds(interval);
    const start = now - (periodInSeconds * 10); // 10 candles back

    // Fetch chart data from API Ninjas
    const chartRes = await fetch(
      `https://api.api-ninjas.com/v1/commoditypricehistorical?name=${symbol}&period=${interval}&start=${start}&end=${now}`,
      {
        headers: { 
          "Accept": "application/json",
          "X-Api-Key": process.env.NINJA_API_KEY || ""
        },
        next: { revalidate: 300 }, // cache for 5 minutes
      }
    );
    console.log(`https://api.api-ninjas.com/v1/commoditypricehistorical?name=${symbol}&period=${interval}&start=${start}&end=${now}`);
    // console.log(chartRes);
    // if (!chartRes.ok) {
    //   return NextResponse.json({ error: "Failed to fetch chart data" }, { status: chartRes.status });
    // }

    const chartData = await chartRes.json();
    console.log(chartData);
    return NextResponse.json(chartData);
  } catch (e) {
    console.error("Commodities chart API error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// Helper function to convert period to seconds
function getPeriodInSeconds(interval: string): number {
  const periodMap: { [key: string]: number } = {
    "1m": 60,        // 1 minute
    "5m": 300,       // 5 minutes
    "15m": 900,      // 15 minutes
    "30m": 1800,     // 30 minutes
    "1h": 3600,      // 1 hour
    "4h": 14400,     // 4 hours
    "1d": 86400      // 1 day
  };
  
  return periodMap[interval] || 3600; // Default to 1 hour if invalid period
}
