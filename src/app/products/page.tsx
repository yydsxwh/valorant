import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "产品" };

export default function ProductsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-semibold">产品</h1>
      <p className="mt-2 max-w-2xl text-muted">
        瞬懂已挂在主站产品中心，也可在这里直接打开。
      </p>
      <article className="panel clip-card mt-8 max-w-xl p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-red/15 px-2.5 py-0.5 text-xs text-red">单独上线</span>
          <span className="text-xs text-muted">无畏契约点位社区</span>
        </div>
        <h2 className="mt-3 text-2xl font-semibold">瞬懂 SHUNDONG</h2>
        <p className="mt-2 text-sm leading-7 text-muted">
          上传点位教学视频和图文攻略笔记，支持评论、点赞、收藏和分享。按地图、英雄和用途检索。
        </p>
        <Link href="/" className="mt-5 inline-flex bg-red px-5 py-2.5 clip-btn">
          打开瞬懂
        </Link>
      </article>
    </div>
  );
}
