import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

// Calculate fine for late returns
export async function POST(req: NextRequest) {
  try {
    const { borrowId, dueDate } = await req.json();

    if (!borrowId || !dueDate) {
      return NextResponse.json(
        { error: "borrowId and dueDate are required" },
        { status: 400 }
      );
    }

    // Get fine settings
    let settings = await prisma.fineSettings.findFirst();
    if (!settings) {
      settings = await prisma.fineSettings.create({
        data: {
          finePerSevenDays: 1000,
          maxFine: 50000,
        },
      });
    }

    // Calculate days late
    const dueDateObj = new Date(dueDate);
    const today = new Date();
    const timeDiff = today.getTime() - dueDateObj.getTime();
    const daysLate = Math.ceil(timeDiff / (1000 * 3600 * 24));

    // If not late, fine is 0
    if (daysLate <= 0) {
      return NextResponse.json({
        borrowId,
        daysLate: 0,
        fine: 0,
        periodCount: 0,
      });
    }

    // Calculate fine: number of 7-day periods × fine per 7 days
    const periodCount = Math.ceil(daysLate / 7);
    let fine = periodCount * settings.finePerSevenDays;

    // Cap at max fine
    if (fine > settings.maxFine) {
      fine = settings.maxFine;
    }

    return NextResponse.json({
      borrowId,
      daysLate,
      fine,
      periodCount,
      finePerSevenDays: settings.finePerSevenDays,
      maxFine: settings.maxFine,
    });
  } catch (error) {
    console.error("Error calculating fine:", error);
    return NextResponse.json(
      { error: "Failed to calculate fine" },
      { status: 500 }
    );
  }
}

// GET fines for all borrowed books (returns not returned yet)
export async function GET(req: NextRequest) {
  try {
    // Get fine settings
    let settings = await prisma.fineSettings.findFirst();
    if (!settings) {
      settings = await prisma.fineSettings.create({
        data: {
          finePerSevenDays: 1000,
          maxFine: 50000,
        },
      });
    }

    // Get all borrows that haven't been returned
    const borrows = await prisma.borrow.findMany({
      where: {
        returnDate: null,
        dueDate: {
          lt: new Date(), // Due date is in the past
        },
      },
      include: {
        user: true,
        book: true,
      },
    });

    // Calculate fine for each
    const borrowsWithFines = borrows.map((borrow) => {
      const timeDiff = new Date().getTime() - borrow.dueDate.getTime();
      const daysLate = Math.ceil(timeDiff / (1000 * 3600 * 24));
      const periodCount = Math.ceil(Math.max(0, daysLate) / 7);
      let fine = periodCount * settings.finePerSevenDays;

      if (fine > settings.maxFine) {
        fine = settings.maxFine;
      }

      return {
        ...borrow,
        daysLate: Math.max(0, daysLate),
        calculatedFine: fine,
      };
    });

    return NextResponse.json(borrowsWithFines);
  } catch (error) {
    console.error("Error fetching fines:", error);
    return NextResponse.json(
      { error: "Failed to fetch fines" },
      { status: 500 }
    );
  }
}
