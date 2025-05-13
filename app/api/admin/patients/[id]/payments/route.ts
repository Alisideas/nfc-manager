// app/api/admin/patients/[id]/payments/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // adjust path if different

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const payments = await prisma.payment.findMany({
      where: { patientId: params.id },
      orderBy: { date: "desc" },
    });

    return NextResponse.json(payments);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch payments." },
      { status: 500 }
    );
  }
}

// app/api/admin/patients/[id]/payments/route.ts
export async function POST(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();
  const { amount, method, status, description } = body;

  if (!description || !status || !method || !amount) {
    return new Response("Missing required fields", { status: 400 });
  }

  const newPayment = await prisma.payment.create({
    data: {
      amount : parseFloat(amount),
      method,
      status,
      description,
      patientId: params.id, // ✅ Correct patient ID
    },
  });

  return Response.json(newPayment);
}


