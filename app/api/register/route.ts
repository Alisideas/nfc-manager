import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import prisma from "@/lib/prisma";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, username, password } = body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email is already in use. Please use a different email." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const secretCode = crypto.randomBytes(16).toString("hex");

    const user = await prisma.user.create({
      data: {
        email,
        username,
        secretCode,
        hashedPassword,
      },
    });

    // Automatically assign 1-month subscription
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);

    await prisma.subscription.create({
      data: {
        userId: user.id,
        plan: "basic",
        startDate,
        endDate,
        status: "active",
      },
    });

    return NextResponse.json({
      message: "User created and subscribed for 1 month successfully.",
    });
  } catch (error) {
    console.error("Error during registration:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
