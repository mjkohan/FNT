import { NextResponse, NextRequest } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const query = searchParams.get("query");
    const page = searchParams.get("page") || "1";
    const country = searchParams.get("country") || "us";
    const category = searchParams.get("category") || "business";
    const pageSize = searchParams.get("pageSize") || "10";

    if (!type) {
      return NextResponse.json({ error: "Type parameter is required" }, { status: 400 });
    }

    let backendUrl: string;
    
    switch (type) {
      case 'crypto':
        if (!query) {
          return NextResponse.json({ error: "Query parameter is required for crypto news" }, { status: 400 });
        }
        backendUrl = `${BACKEND_URL}/api/news/crypto?query=${encodeURIComponent(query)}&page=${page}`;
        break;
      case 'commodities':
        if (!query) {
          return NextResponse.json({ error: "Query parameter is required for commodities news" }, { status: 400 });
        }
        backendUrl = `${BACKEND_URL}/api/news/commodities?query=${encodeURIComponent(query)}&page=${page}`;
        break;
      case 'stocks':
        if (!query) {
          return NextResponse.json({ error: "Query parameter is required for stock news" }, { status: 400 });
        }
        backendUrl = `${BACKEND_URL}/api/news/stocks?query=${encodeURIComponent(query)}&page=${page}`;
        break;
      case 'top-headlines':
        backendUrl = `${BACKEND_URL}/api/news/top-headlines?country=${country}&category=${category}&pageSize=${pageSize}`;
        break;
      default:
        return NextResponse.json({ error: "Invalid type parameter" }, { status: 400 });
    }

    const response = await fetch(backendUrl, {
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 });
  }
}
