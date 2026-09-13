import type { Metadata } from "next";
import { Suspense } from "react";
import { FilterBar } from "@/components/FilterBar";
import { PostCard } from "@/components/PostCard";
import { getCurrentUser } from "@/lib/auth";
import { listPosts } from "@/lib/db";

export const metadata: Metadata = { title: "点位库" };

export default async function LibraryPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = await searchParams;
  const user = await getCurrentUser();
  const { posts, total } = listPosts(
    {
      q: str(query.q),
      type: str(query.type),
      mapId: str(query.map),
      agentId: str(query.agent),
      side: str(query.side),
      site: str(query.site),
      purpose: str(query.purpose),
      difficulty: str(query.difficulty),
      sort: (str(query.sort) as "new" | "hot" | "likes") || "hot",
      limit: 36,
    },
    user?.id,
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-semibold">点位教程库</h1>
      <p className="mt-2 text-muted">像翻库存一样筛地图、英雄和用途。当前 {total} 条。</p>
      <div className="surface mt-6 p-4">
        <Suspense>
          <FilterBar basePath="/library" />
        </Suspense>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => <PostCard key={p.id} post={p} />)}
      </div>
    </div>
  );
}

function str(v: string | string[] | undefined) {
  return Array.isArray(v) ? v[0] : v;
}
