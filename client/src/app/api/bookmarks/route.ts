import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    let backendUrl = `${BACKEND_URL}/api/bookmarks`;
    if (category) {
      backendUrl += `/category/${category}`;
    }

    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${session.accessToken}`,
      },
      next: { revalidate: 60 }, // Cache for 1 minute
    });

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    return NextResponse.json({ error: "Failed to fetch bookmarks" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { action } = body;

    let backendUrl: string;
    let method: string;

    if (action === 'toggle') {
      backendUrl = `${BACKEND_URL}/api/bookmarks/toggle`;
      method = 'POST';
    } else {
      backendUrl = `${BACKEND_URL}/api/bookmarks`;
      method = 'POST';
    }

    const response = await fetch(backendUrl, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error processing bookmark request:', error);
    return NextResponse.json({ error: "Failed to process bookmark request" }, { status: 500 });
  }
}
