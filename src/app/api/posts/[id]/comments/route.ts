import { getCurrentUser } from "@/lib/auth";
import { addComment, listComments } from "@/lib/db";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  return Response.json({ comments: listComments(id, user?.id) });
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "请先登录" }, { status: 401 });
  const { id } = await params;
  const body = await req.json();
  const text = String(body.body || "").trim();
  if (text.length < 1) return Response.json({ error: "评论不能空" }, { status: 400 });
  if (text.length > 1000) return Response.json({ error: "评论太长了" }, { status: 400 });
  const comments = addComment({
    postId: id,
    authorId: user.id,
    body: text,
    parentId: body.parentId || null,
  });
  return Response.json({ comments });
}
