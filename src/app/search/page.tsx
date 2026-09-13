import type { Metadata } from "next";
import { PostCard } from "@/components/PostCard";
import { getCurrentUser } from "@/lib/auth";
import { listPosts } from "@/lib/db";

export const metadata: Metadata = { title: "搜索" };

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const user = await getCurrentUser();
  const { posts, total } = listPosts({ q, limit: 36 }, user?.id);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-semibold">搜索「{q || "全部"}」</h1>
      <p className="mt-2 text-muted">找到 {total} 条相关内容。</p>
      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => <PostCard key={p.id} post={p} />)}
      </div>
    </div>
  );
}
