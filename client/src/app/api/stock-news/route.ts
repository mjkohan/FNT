import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const symbol = searchParams.get("symbol");
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    if (!symbol) {
      return NextResponse.json({ error: "Symbol parameter is required" }, { status: 400 });
    }

    // Forward request to backend server
    const backendUrl = new URL(`${process.env.BACKEND_URL || 'http://localhost:3000'}/api/stock-news/${symbol}`);
    if (from) backendUrl.searchParams.set('from', from);
    if (to) backendUrl.searchParams.set('to', to);

    const response = await fetch(backendUrl.toString(), {
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching stock news:', error);
    return NextResponse.json({ error: "Failed to fetch stock news" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { symbols, from, to } = body;

    if (!symbols || !Array.isArray(symbols)) {
      return NextResponse.json({ error: "Symbols array is required" }, { status: 400 });
    }

    // Forward request to backend server
    const backendUrl = `${process.env.BACKEND_URL || 'http://localhost:3000'}/api/stock-news/batch`;
    
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ symbols, from, to }),
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching batch stock news:', error);
    return NextResponse.json({ error: "Failed to fetch batch stock news" }, { status: 500 });
  }
}
