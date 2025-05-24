// /app/api/send-desktop-link/route.ts
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail", // or any SMTP provider
      auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Download NFC Desktop App",
      html: `
        <p>Hi there,</p>
        <p>You can download the NFC Desktop App from the following link:</p>
        <p><a href="https://your-public-download-link.com">Download App</a></p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Email sending error:", err);
    return NextResponse.json({ error: "Email failed" }, { status: 500 });
  }
}
