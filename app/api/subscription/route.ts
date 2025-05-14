import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import getCurrentUser from "@/app/actions/getCurrentUser"; // adjust path if needed

export async function GET() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: currentUser.id,
        status: "active",
      },
    });

    return NextResponse.json({ subscription });
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
