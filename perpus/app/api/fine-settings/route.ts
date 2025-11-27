import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

// GET fine settings
export async function GET() {
  try {
    let settings = await prisma.fineSettings.findFirst();

    // If no settings exist, create default ones
    if (!settings) {
      settings = await prisma.fineSettings.create({
        data: {
          finePerSevenDays: 1000,
          maxFine: 50000,
        },
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error fetching fine settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch fine settings" },
      { status: 500 }
    );
  }
}

// PATCH update fine settings
export async function PATCH(req: NextRequest) {
  try {
    const { finePerSevenDays, maxFine } = await req.json();

    // Validate input
    if (
      typeof finePerSevenDays !== "number" ||
      typeof maxFine !== "number"
    ) {
      return NextResponse.json(
        { error: "Invalid input parameters" },
        { status: 400 }
      );
    }

    if (finePerSevenDays < 100 || finePerSevenDays > 100000) {
      return NextResponse.json(
        { error: "Denda per 7 hari harus antara Rp 100 - Rp 100.000" },
        { status: 400 }
      );
    }

    if (maxFine < finePerSevenDays || maxFine > 1000000) {
      return NextResponse.json(
        { error: "Maksimal denda harus lebih besar dari denda per 7 hari dan tidak boleh lebih dari Rp 1.000.000" },
        { status: 400 }
      );
    }

    // Get existing settings or create if not exists
    let settings = await prisma.fineSettings.findFirst();

    if (!settings) {
      settings = await prisma.fineSettings.create({
        data: {
          finePerSevenDays,
          maxFine,
        },
      });
    } else {
      settings = await prisma.fineSettings.update({
        where: { id: settings.id },
        data: {
          finePerSevenDays,
          maxFine,
        },
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error updating fine settings:", error);
    return NextResponse.json(
      { error: "Failed to update fine settings" },
      { status: 500 }
    );
  }
}
