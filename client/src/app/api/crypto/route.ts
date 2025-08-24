import { NextResponse } from "next/server";

export async function GET() {
  try {
    
    const res = await fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd", {
      headers: { "Accept": "application/json" },
      next: { revalidate: 60 }, // cache for 1 min
    });
    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (e) {
    console.log(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
} 