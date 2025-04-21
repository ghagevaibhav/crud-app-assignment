import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { headers } from "next/headers";

const prisma = new PrismaClient();

// GET /api/data - Get all data for the authenticated user
export async function GET() {
  try {
    // Get API credentials from headers
    const headersList = await headers();
    const apiKey = headersList.get("x-api-key") || "";
    const apiUrl = headersList.get("x-api-url") || "";

    // Validate API credentials
    if (!apiKey || !apiUrl) {
      return NextResponse.json(
        { error: "API credentials are required" },
        { status: 401 }
      );
    }

    // Find user by API credentials
    const user = await prisma.user.findFirst({
      where: {
        apiKey,
        apiUrl,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid API credentials" },
        { status: 401 }
      );
    }

    if (user.credits <= 0) {
      return NextResponse.json(
        { error: "Credits exhausted. Please recharge to continue using the API." },
        { status: 403 }
      );
    }

    // Deduct one credit for the API call
    await prisma.user.update({
      where: { id: user.id },
      data: { credits: user.credits - 1 },
    });

    const data = await prisma.data.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("GET /api/data error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/data - Create new data
export async function POST(request: Request) {
  try {
    // Get API credentials from headers
    const headersList = await headers();
    const apiKey = headersList.get("x-api-key") || "";
    const apiUrl = headersList.get("x-api-url") || "";

    // Validate API credentials
    if (!apiKey || !apiUrl) {
      return NextResponse.json(
        { error: "API credentials are required" },
        { status: 401 }
      );
    }

    // Find user by API credentials
    const user = await prisma.user.findFirst({
      where: {
        apiKey,
        apiUrl,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid API credentials" },
        { status: 401 }
      );
    }

    if (user.credits <= 0) {
      return NextResponse.json(
        { error: "Credits exhausted. Please recharge to continue using the API." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, content } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    // Deduct one credit for the API call
    await prisma.user.update({
      where: { id: user.id },
      data: { credits: user.credits - 1 },
    });

    const data = await prisma.data.create({
      data: {
        title,
        content,
        userId: user.id,
      },
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("POST /api/data error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 