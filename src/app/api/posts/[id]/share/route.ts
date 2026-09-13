import { getCurrentUser } from "@/lib/auth";
import { addShare } from "@/lib/db";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  const body = await req.json().catch(() => ({}));
  const post = addShare(id, String(body.channel || "link"), user?.id);
  return Response.json({ post });
}
