import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import sharp from "sharp";
import prisma from "@/lib/prisma";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Unsupported file type" },
      { status: 400 },
    );
  }

  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json(
      { error: "File too large (max 5MB)" },
      { status: 400 },
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = path.extname(file.name) || ".jpg";
  const uniqueName = `${randomUUID()}${ext}`;
  const filePath = path.join(process.cwd(), "public", "uploads", uniqueName);

  await writeFile(filePath, buffer);

  let width: number | undefined;
  let height: number | undefined;
  try {
    const metadata = await sharp(buffer).metadata();
    width = metadata.width;
    height = metadata.height;
  } catch {
    // Non-fatal — dimensions are optional metadata
  }

  const media = await prisma.media.create({
    data: {
      filename: file.name,
      url: `/uploads/${uniqueName}`,
      mimeType: file.type,
      size: file.size,
      width,
      height,
    },
  });

  return NextResponse.json(media);
}
