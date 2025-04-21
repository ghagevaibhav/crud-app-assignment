import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { headers } from "next/headers";

const prisma = new PrismaClient();

// GET /api/data/[id] - Get a specific data item
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    const data = await prisma.data.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
    });

    if (!data) {
      return NextResponse.json({ error: "Data not found" }, { status: 404 });
    }

    // Deduct one credit for the API call
    await prisma.user.update({
      where: { id: user.id },
      data: { credits: user.credits - 1 },
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("GET /api/data/[id] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/data/[id] - Update a specific data item
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    const data = await prisma.data.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
    });

    if (!data) {
      return NextResponse.json({ error: "Data not found" }, { status: 404 });
    }

    // Deduct one credit for the API call
    await prisma.user.update({
      where: { id: user.id },
      data: { credits: user.credits - 1 },
    });

    const updatedData = await prisma.data.update({
      where: { id: params.id },
      data: { title, content },
    });

    return NextResponse.json(updatedData);
  } catch (error) {
    console.error("PUT /api/data/[id] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/data/[id] - Delete a specific data item
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    const data = await prisma.data.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
    });

    if (!data) {
      return NextResponse.json({ error: "Data not found" }, { status: 404 });
    }

    // Deduct one credit for the API call
    await prisma.user.update({
      where: { id: user.id },
      data: { credits: user.credits - 1 },
    });

    await prisma.data.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Data deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/data/[id] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 