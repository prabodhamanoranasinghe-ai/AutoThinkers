import { randomUUID } from "crypto";
import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

function expectedKey() {
  return process.env.PUBLISH_KEY || "autothinkers";
}

const allowed = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]);

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const publishKey = String(form.get("publishKey") || "");
    if (publishKey !== expectedKey()) {
      return NextResponse.json({ error: "Invalid publish key" }, { status: 401 });
    }

    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (!allowed.has(file.type)) {
      return NextResponse.json(
        { error: "Unsupported image type. Use PNG, JPEG, WebP, GIF, or SVG." },
        { status: 400 },
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "Image must be under 5MB" }, { status: 400 });
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    const ext =
      file.type === "image/png"
        ? "png"
        : file.type === "image/jpeg"
          ? "jpg"
          : file.type === "image/webp"
            ? "webp"
            : file.type === "image/gif"
              ? "gif"
              : "svg";

    const uploadsDir = path.join(process.cwd(), "public/uploads");
    fs.mkdirSync(uploadsDir, { recursive: true });
    const filename = `${Date.now()}-${randomUUID().slice(0, 8)}.${ext}`;
    fs.writeFileSync(path.join(uploadsDir, filename), bytes);

    return NextResponse.json({ ok: true, url: `/uploads/${filename}` });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 500 },
    );
  }
}
