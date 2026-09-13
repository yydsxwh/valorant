import { getCurrentUser } from "@/lib/auth";
import { toggleLike } from "@/lib/db";

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "请先登录" }, { status: 401 });
  const { id } = await params;
  return Response.json(toggleLike(user.id, "post", id));
}
