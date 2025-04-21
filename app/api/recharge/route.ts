import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { headers } from "next/headers";

const prisma = new PrismaClient();

export async function POST() {
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

    if (user.rechargeCount >= 1) {
      return NextResponse.json(
        { error: "Credits exhausted. Cannot recharge again." },
        { status: 403 }
      );
    }

    // Recharge credits and increment recharge count
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        credits: 4,
        rechargeCount: user.rechargeCount + 1,
      },
    });

    return NextResponse.json({
      message: "Credits recharged successfully",
      credits: updatedUser.credits,
    });
  } catch (error) {
    console.error("POST /api/recharge error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 