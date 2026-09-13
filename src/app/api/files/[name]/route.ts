import { readFileSync } from "fs";
import { join } from "path";

const MIME: Record<string, string> = {
  mp4: "video/mp4",
  webm: "video/webm",
  mov: "video/quicktime",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
};

export async function GET(_req: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  if (!/^[a-f0-9]+\.[a-z0-9]+$/.test(name)) {
    return new Response("bad name", { status: 400 });
  }
  try {
    const buf = readFileSync(join(process.cwd(), "data", "uploads", name));
    const ext = name.split(".").pop() || "";
    return new Response(buf, {
      headers: {
        "Content-Type": MIME[ext] || "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("not found", { status: 404 });
  }
}
