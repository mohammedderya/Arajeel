import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/server-auth";
import { prisma } from "@/lib/prisma";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024;

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  if (!await requireAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });
    if (!ALLOWED_TYPES.includes(file.type)) return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    if (file.size > MAX_SIZE) return NextResponse.json({ error: "File too large" }, { status: 400 });

    const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64Data = buffer.toString("base64");
    const cleanId = params.id.split(".")[0];

    await prisma.upload.upsert({
      where: { id: cleanId },
      create: { id: cleanId, data: base64Data, mimeType: file.type },
      update: { data: base64Data, mimeType: file.type },
    });

    return NextResponse.json({ secure_url: `/uploads/${cleanId}.${ext}` });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const cleanId = params.id.split(".")[0];
    const upload = await prisma.upload.findUnique({ where: { id: cleanId } });
    if (!upload) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const buffer = Buffer.from(upload.data, "base64");
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": upload.mimeType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to load image" }, { status: 500 });
  }
}
