import { getCurrentUser } from "@/lib/auth";
import { getPost, incrementView } from "@/lib/db";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  const post = getPost(id, user?.id);
  if (!post) return Response.json({ error: "没有这条内容" }, { status: 404 });
  incrementView(id);
  return Response.json({ post });
}
