import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";
import { IncomingForm } from "formidable";
import fs from "fs";
import { promisify } from "util";

// Enable reading multipart form
export const routeSegmentConfig = {
  api: {
    bodyParser: false,
  },
};

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

// Helper to parse multipart form
const parseForm = async (req: NextRequest): Promise<{ file: any }> => {
  const form = new IncomingForm({ keepExtensions: true });
  const parse = promisify(form.parse);
  // @ts-ignore
  return parse(req);
};

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  try {
    const res = await new Promise<{ secure_url: string }>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "patients" }, (err: any, result: any) => {
          if (err || !result) return reject(err);
          resolve(result);
        })
        .end(buffer);
    });

    return NextResponse.json({ url: res.secure_url });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
