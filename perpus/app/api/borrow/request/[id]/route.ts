import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const requestId = parseInt(resolvedParams.id);

    const borrow = await prisma.borrow.delete({
      where: { id: requestId },
    });

    return NextResponse.json({ message: "Request deleted", borrow });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const requestId = parseInt(resolvedParams.id);
    const { status } = await req.json();

    const borrow = await prisma.borrow.update({
      where: { id: requestId },
      data: { status },
      include: { book: true, user: true },
    });

    return NextResponse.json(borrow);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
