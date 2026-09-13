import type { Metadata } from "next";
import Link from "next/link";
import { PostCard } from "@/components/PostCard";
import { getCurrentUser } from "@/lib/auth";
import { listPosts } from "@/lib/db";

export const metadata: Metadata = { title: "社区" };

export default async function CommunityPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = await searchParams;
  const sort = (Array.isArray(query.sort) ? query.sort[0] : query.sort) || "new";
  const type = Array.isArray(query.type) ? query.type[0] : query.type;
  const user = await getCurrentUser();
  const { posts } = listPosts({ sort: sort as "new" | "hot" | "likes", type, limit: 24 }, user?.id);

  const tabs = [
    { href: "/community", label: "最新", on: sort === "new" && !type },
    { href: "/community?sort=hot", label: "最热", on: sort === "hot" && !type },
    { href: "/community?type=video", label: "视频", on: type === "video" },
    { href: "/community?type=guide", label: "图文", on: type === "guide" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">社区动态</h1>
          <p className="mt-2 text-muted">玩家刚传上来的教学和笔记，点开就能评、赞、藏、转。</p>
        </div>
        <Link href="/submit" className="btn btn-primary text-sm">发布内容</Link>
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <Link key={t.href} href={t.href} className={`chip ${t.on ? "chip-on" : ""}`}>
            {t.label}
          </Link>
        ))}
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => <PostCard key={p.id} post={p} />)}
      </div>
    </div>
  );
}
