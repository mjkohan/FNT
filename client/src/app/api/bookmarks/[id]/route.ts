import { auth } from "@/auth";
import { NextResponse, NextRequest } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth()
    
    if (!session?.accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const body = await req.json();

    const backendUrl = `${BACKEND_URL}/api/bookmarks/${id}`;

    const response = await fetch(backendUrl, {
      method: 'PUT',
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
    console.error('Error updating bookmark:', error);
    return NextResponse.json({ error: "Failed to update bookmark" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth()
    
    if (!session?.accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    const backendUrl = `${BACKEND_URL}/api/bookmarks/${id}`;

    const response = await fetch(backendUrl, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${session.accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting bookmark:', error);
    return NextResponse.json({ error: "Failed to delete bookmark" }, { status: 500 });
  }
}
