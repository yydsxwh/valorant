import type { Metadata } from "next";
import Link from "next/link";
import { MAPS } from "@/lib/catalog";
import { listPosts } from "@/lib/db";

export const metadata: Metadata = { title: "地图点位" };

export default function MapsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-semibold">按地图查点位</h1>
      <p className="mt-2 text-muted">先选一张图，再按英雄、阵营和包点筛选。</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MAPS.map((m) => {
          const { total } = listPosts({ mapId: m.id, limit: 1 });
          return (
            <Link key={m.id} href={`/maps/${m.id}`} className="surface group overflow-hidden">
              <div className="h-28" style={{ background: `linear-gradient(120deg, ${m.accentSoft}, color-mix(in srgb, ${m.accent} 40%, white))` }} />
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium group-hover:text-brand">{m.name}</h2>
                  <span className="text-xs text-muted">{total} 条</span>
                </div>
                <p className="mt-1 text-sm text-muted">{m.blurb}</p>
                <p className="mt-3 text-xs text-muted">{m.nameEn} · {m.sites.join(" / ")}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
