import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";
// import { sendVerificationEmail } from "@/app/libs/email";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, username, password, getsecretCode } = body;

    // Check if the email is already registered
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email is already in use. Please use a different email." },
        { status: 400 }
      );
    }

    // Extract IP address

    // Hash password and generate verification token
    const hashedPassword = await bcrypt.hash(password, 12);
    const secretCode = crypto.randomBytes(16).toString("hex");

    // Create user in database
    const user = await prisma.user.create({
      data: {
        email,
        username,
        secretCode,
        hashedPassword,
      },
    });


    return NextResponse.json({
      message: "User created successfully. Please check your email to verify your account.",
    });
  } catch (error) {
    console.error("Error during registration:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
