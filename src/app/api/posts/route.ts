import { getCurrentUser } from "@/lib/auth";
import { parseVideoSource } from "@/lib/catalog";
import { createPost, listPosts } from "@/lib/db";
import type { GuideStep } from "@/lib/types";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const user = await getCurrentUser();
  const data = listPosts(
    {
      q: url.searchParams.get("q") || undefined,
      type: url.searchParams.get("type") || undefined,
      mapId: url.searchParams.get("map") || undefined,
      agentId: url.searchParams.get("agent") || undefined,
      side: url.searchParams.get("side") || undefined,
      site: url.searchParams.get("site") || undefined,
      purpose: url.searchParams.get("purpose") || undefined,
      difficulty: url.searchParams.get("difficulty") || undefined,
      sort: (url.searchParams.get("sort") as "new" | "hot" | "likes") || "new",
      limit: Number(url.searchParams.get("limit") || 24),
    },
    user?.id,
  );
  return Response.json(data);
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "请先登录" }, { status: 401 });
  const body = await req.json();
  const title = String(body.title || "").trim();
  const summary = String(body.summary || "").trim();
  if (title.length < 4) return Response.json({ error: "标题再写清楚一点" }, { status: 400 });
  if (summary.length < 4) return Response.json({ error: "请补一句摘要" }, { status: 400 });
  const source = parseVideoSource(String(body.videoUrl || ""));
  const steps = (Array.isArray(body.steps) ? body.steps : []) as GuideStep[];
  const post = createPost({
    authorId: user.id,
    type: body.type === "guide" ? "guide" : "video",
    title,
    summary,
    body: String(body.body || ""),
    videoKind: body.videoKind || source.kind,
    videoUrl: body.videoUrl || source.url,
    coverUrl: String(body.coverUrl || ""),
    mapId: String(body.mapId || "ascent"),
    agentId: String(body.agentId || "sova"),
    ability: String(body.ability || ""),
    side: String(body.side || "进攻"),
    site: String(body.site || "A"),
    area: String(body.area || ""),
    purpose: String(body.purpose || "DEFAULT"),
    difficulty: String(body.difficulty || "简单"),
    startX: Number(body.startX ?? 30),
    startY: Number(body.startY ?? 60),
    landX: Number(body.landX ?? 70),
    landY: Number(body.landY ?? 30),
    steps,
    tags: Array.isArray(body.tags) ? body.tags.map(String) : ["社区投稿"],
  });
  return Response.json({ post });
}
