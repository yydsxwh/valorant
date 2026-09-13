import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FilterBar } from "@/components/FilterBar";
import { PostCard } from "@/components/PostCard";
import { getCurrentUser } from "@/lib/auth";
import { getMap } from "@/lib/catalog";
import { listPosts } from "@/lib/db";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const map = getMap(slug);
  return { title: map ? `${map.name}点位` : "地图" };
}

export default async function MapDetail({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await params;
  const query = await searchParams;
  const map = getMap(slug);
  if (!map) notFound();
  const user = await getCurrentUser();
  const { posts } = listPosts(
    {
      mapId: slug,
      type: str(query.type),
      agentId: str(query.agent),
      side: str(query.side),
      site: str(query.site),
      purpose: str(query.purpose),
      difficulty: str(query.difficulty),
      sort: "hot",
      limit: 40,
    },
    user?.id,
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs text-muted">{map.nameEn}</p>
          <h1 className="text-3xl font-semibold">{map.name}</h1>
          <p className="mt-2 max-w-2xl text-muted">{map.blurb}</p>
        </div>
        <Link href="/submit" className="btn btn-primary text-sm">在这张图投稿</Link>
      </div>
      <div className="surface relative mt-8 aspect-[16/7] overflow-hidden" style={{ background: `radial-gradient(circle at 30% 30%, color-mix(in srgb, ${map.accent} 28%, white), var(--bg-deep))` }}>
        {posts.map((p) => (
          <Link
            key={p.id}
            href={`/posts/${p.id}`}
            title={p.title}
            className="absolute h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/70"
            style={{ left: `${p.landX}%`, top: `${p.landY}%`, background: p.side === "进攻" ? "var(--fire)" : "var(--brand)" }}
          />
        ))}
        <div className="absolute bottom-3 left-3 text-xs text-ink/70">点缀色进攻 · 主色防守 · 点击查看教学</div>
      </div>
      <div className="surface mt-8 p-4">
        <FilterBar basePath={`/maps/${slug}`} />
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => <PostCard key={p.id} post={p} />)}
      </div>
      {posts.length === 0 && <p className="mt-10 text-center text-muted">这张图还没有匹配的内容，来当第一位作者。</p>}
    </div>
  );
}

function str(v: string | string[] | undefined) {
  return Array.isArray(v) ? v[0] : v;
}
