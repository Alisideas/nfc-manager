import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// app/api/admin/payments/[paymentId]/route.ts
export async function PUT(
  req: NextRequest,
  { params }: { params: { paymentId: string } }
) {
  try {
    const body = await req.json();
    const updated = await prisma.payment.update({
      where: { id: params.paymentId },
      data: body,
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update payment." }, { status: 500 });
  }
}

// app/api/admin/payments/[paymentId]/route.ts
export async function DELETE(
  req: NextRequest,
  { params }: { params: { paymentId: string } }
) {
  try {
    await prisma.payment.delete({
      where: { id: params.paymentId },
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to delete payment." }, { status: 500 });
  }
}

