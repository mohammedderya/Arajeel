import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_request: NextRequest, { params }: { params: { filename: string } }) {
  try {
    const cleanId = params.filename.split(".")[0];
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

