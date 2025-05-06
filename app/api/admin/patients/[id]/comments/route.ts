import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const { content } = body;

  if (!content) {
    return NextResponse.json({ error: "Content required" }, { status: 400 });
  }

  const comment = await prisma.comment.create({
    data: {
      content,
      patientId: params.id,
    },
  });

  return NextResponse.json(comment);
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const comments = await prisma.comment.findMany({
      where: { patientId: params.id },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(comments);
  }
  