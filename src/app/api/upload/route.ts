import { randomBytes } from "crypto";
import { mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import { getCurrentUser } from "@/lib/auth";

export const runtime = "nodejs";

const ALLOWED = new Set([
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "请先登录" }, { status: 401 });
  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return Response.json({ error: "没有文件" }, { status: 400 });
  if (file.size > 80 * 1024 * 1024) return Response.json({ error: "文件不能超过 80MB" }, { status: 400 });
  if (!ALLOWED.has(file.type)) return Response.json({ error: "只支持常见视频和图片" }, { status: 400 });
  const ext = file.name.split(".").pop()?.toLowerCase() || "bin";
  const safeExt = ["mp4", "webm", "mov", "jpg", "jpeg", "png", "webp", "gif"].includes(ext) ? ext : "bin";
  const name = `${randomBytes(12).toString("hex")}.${safeExt}`;
  const dir = join(process.cwd(), "data", "uploads");
  mkdirSync(dir, { recursive: true });
  const buf = Buffer.from(await file.arrayBuffer());
  writeFileSync(join(dir, name), buf);
  return Response.json({ url: `/api/files/${name}` });
}
